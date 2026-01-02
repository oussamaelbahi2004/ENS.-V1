if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch((err) => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// PWA Install Button Logic
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;

    // Create and show the install button
    showInstallButton();
});

function showInstallButton() {
    // Check if button already exists
    if (document.getElementById('pwa-install-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'pwa-install-btn';
    btn.innerHTML = `
        <span style="font-size: 1.25rem;">📱</span>
        <span style="font-weight: 600;">Installer l'App</span>
    `;

    // Styles for the floating button
    Object.assign(btn.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: '9999',
        backgroundColor: '#3b82f6', // blue-500
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '50px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.3s ease',
        transform: 'translateY(100px)', // Start hidden
        fontFamily: "'Segoe UI', sans-serif"
    });

    btn.addEventListener('mouseenter', () => {
        btn.style.backgroundColor = '#2563eb'; // blue-600
        btn.style.transform = 'translateY(0) scale(1.05)';
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.backgroundColor = '#3b82f6';
        btn.style.transform = 'translateY(0) scale(1)';
    });

    // Install Click Handler
    btn.addEventListener('click', async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);

        // We've used the prompt, and can't use it again, throw it away
        deferredPrompt = null;

        // Hide button
        hideInstallButton();
    });

    document.body.appendChild(btn);

    // Animate in
    requestAnimationFrame(() => {
        btn.style.transform = 'translateY(0)';
    });
}

function hideInstallButton() {
    const btn = document.getElementById('pwa-install-btn');
    if (btn) {
        btn.style.transform = 'translateY(100px)';
        setTimeout(() => btn.remove(), 300);
    }
}

// Create Icons if Lucide is loaded (Optional helper if this script runs alone)
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}

window.addEventListener('appinstalled', () => {
    hideInstallButton();
    console.log('PWA was installed');
});

/**
  |--------------------------------------------------------------------------
  | Código para NextU - JavaScript Principal
  |--------------------------------------------------------------------------
  |
  | Tiene las siguientes funcionalidades:
  |
  | 1) Cuando se cargué el DOM, comienza las funcionalidades Js.
  | 2) Inicializa el juego.
  | 3) Registra el Service Worker
  | 4) Definir las cookies
  | 5) Enable display of Installation button
  |
  |--------------------------------------------------------------------------
  | @author Daniel Valencia <2020/07/06> <danielfelipeluis@outlook>
  |--------------------------------------------------------------------------
*/

$(function () {
    /**
     * Inicializa el juego: [game.js]
     * @author Daniel Valencia <2020/07/15>
     */
    Game.init()

    /**
     * Registra el Service Worker
     * @author Daniel Valencia <2020/07/16>
     */
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js', { scope: './' })
            .then(console.log("Service Worker Registered"))
            .catch(err => {
                console.log("Service Worker Failed to Register", err);
            })
    }

    /**
     * Definir las cookies
     */
    document.cookie = 'same-site-cookie=foo; SameSite=Lax';
    document.cookie = 'cross-site-cookie=bar; SameSite=None; Secure';

    /**
     * Si la PWA todavía no está instalada.
     * @author Daniel Valencia <2020/07/16>
     */
    $(window).on("beforeinstallprompt", function(event){
        window.deferredPrompt = event;
        seeInstallationButton()
    })

    /**
     * Cuando se de click en el botón de instalación
     * Se habilitará la opción del navegador para instalar
     * @author Daniel Valencia <2020/07/16>
     */
    $("#butInstall").on("click", function () {
        const promptEvent = window.deferredPrompt;
        if (!promptEvent) return
        promptEvent.prompt();
        promptEvent.userChoice.then((result) => {
            window.deferredPrompt = null;
            seeInstallationButton(true)
        });
    })

    /**
     * Enable display of Installation button
     * @param Boolean see
     */
    function seeInstallationButton(see = false) {
        let classNoShow = "noShow"
        let buttonInstall = $("#installContainer")

        if (see) {
            if (!buttonInstall.hasClass(classNoShow)) buttonInstall.addClass(classNoShow)
        } else {
            if (buttonInstall.hasClass(classNoShow)) buttonInstall.removeClass(classNoShow)
        }
    }

    window.addEventListener('appinstalled', (event) => {
        console.log('👍', 'appinstalled', event);
    });
})

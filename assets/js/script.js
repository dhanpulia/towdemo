document.addEventListener("DOMContentLoaded", function () {

    const modalWrapper = document.querySelector('.modalWrapper');
    const modalVideoWrapper = document.querySelector('.modalVideoWrapper');
    const player = document.getElementById('player');
    const initialSrc = player.getAttribute('src');

    document.querySelector('.rightLinkBtnMute').addEventListener('click', function () {
        const video = document.querySelector('.main-video');
        video.muted = !video.muted;

        this.style.background = video.muted
            ? 'url(/assets/images/btn_off.webp) 50% 50% / contain no-repeat'
            : 'url(/assets/images/btn_voice.webp) 50% 50% / contain no-repeat';
    });

    document.querySelector('.main-wrapper .main-playBtn').addEventListener('click', function () {
        console.log('clicked!');
        modalWrapper.classList.add('modalWrapper-active');
        modalVideoWrapper.classList.add('modalVideoWrapper-active');

        const video = document.querySelector('.main-video');
        video.muted = true;

        document.querySelector('.rightLinkBtnMute').style.background =
            'url(/assets/images/btn_off.webp) 50% 50% / contain no-repeat';
    });

    document.querySelector('.modalCloseBtn').addEventListener('click', closeModal);

    function closeModal() {
        console.log("function called");
        modalWrapper.classList.remove('modalWrapper-active');
        modalVideoWrapper.classList.remove('modalVideoWrapper-active');
        player.setAttribute('src', '');
        player.setAttribute('src', initialSrc);
    }

    modalWrapper.addEventListener('click', function (e) {
        if (!modalVideoWrapper.contains(e.target)) {
            closeModal();
        }
    });

    function getCookie(cName) {
        const name = cName + "=";
        const cDecoded = decodeURIComponent(document.cookie);
        const cArr = cDecoded.split("; ");
        let value;
        cArr.forEach(val => {
            if (val.indexOf(name) === 0) value = val.substring(name.length);
        });
        return value;
    }

    document.querySelector(".cookiePolicy-acceptBtn").addEventListener('click', function () {
        document.querySelector(".cookiePolicyWrapper").style.display = "none";
        setCookie("cookie", true, 30);
    });

    function setCookie(cName, cValue, expDays) {
        let date = new Date();
        date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = `${cName}=${cValue}; ${expires}; path=/; SameSite=Lax; Secure`;
    }

    function cookieMessage() {
        if (!getCookie("cookie")) {
            document.querySelector(".cookiePolicyWrapper").style.display = "flex";
        }
    }

    document.querySelector(".cookiePolicy-closeBtn").addEventListener('click', function () {
        document.querySelector(".cookiePolicyWrapper").style.display = "none";
        setCookie("cookie", false, 30);
    });

    cookieMessage();

    let translations = {};

    // Fetch translations from JSON file
    fetch("/assets/translations.json")
        .then(response => response.json())
        .then(data => {
            translations = data;
            updateLanguage("zh"); // Default to Chinese on load
        });

    // Event listener for language selection
    document.getElementById("language-select").addEventListener("change", function () {
        const selectedLang = this.value;
        updateLanguage(selectedLang);
    });

    // Function to update language
    function updateLanguage(lang) {
        document.querySelectorAll("[data-key]").forEach(function (element) {
            const key = element.getAttribute("data-key");

            // Check if it's an image
            if (element.tagName.toLowerCase() === "img") {
                element.setAttribute("src", translations[lang][key]);
            } else {
                element.textContent = translations[lang][key];
            }
        });
    }
});

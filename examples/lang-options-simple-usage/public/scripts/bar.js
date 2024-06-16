const langsTxt = document.getElementById("langs");
const langSelect = document.getElementById("langSelect");

const init = async () => {
    try {
        const langs = await i18n4e.getLangs(); // get the languages

        langsTxt.innerHTML = JSON.stringify(langs); // show the languages in the page

        for (const [langCode, langName] of Object.entries(langs)) {
            const langOption = document.createElement('option');
            langOption.value = langCode; // set the value of the option to the language code
            langOption.textContent = langName;
            langSelect.appendChild(langOption);
        }

        langSelect.addEventListener('change', async () => {
            const selectedLang = langSelect.value;
            await i18n4e.setLang(selectedLang); // set the language
        });
  
    } catch (error) {
        console.error(error);
    }
};

init();

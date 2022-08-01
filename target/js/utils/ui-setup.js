// import $ from 'jquery'
class SetupUI {
    constructor(fn2Call, defConFn2Call) {
        // Add listeners
        window.onload = () => {
            this.init();
            this.addEventListeners(fn2Call, defConFn2Call);
            this.changeTitles();
        };
    }
    init() {
        this.inputArea = document.getElementsByClassName('textarea')[0];
        this.outputArea = document.getElementsByClassName('textarea')[1];
        this.copyButton = document.getElementById('copy');
        this.convertButton = $('#convert');
        this.pasteButton = document.getElementById('paste');
        this.prettifyButton = document.getElementById('pretty');
        this.isFlatCheckbox = document.getElementById('isFlatCheckbox');
        this.title = document.getElementById('title');
        this.checkLabel = document.getElementById('check-label');
        this.selectAction = $('#select-action');
        const cache = this.getInputCache();
        if (cache && cache != undefined)
            this.inputArea.innerText = cache;
    }
    addEventListeners(fn2Call, defConFn2Call) {
        if (this.copyButton && this.prettifyButton && this.pasteButton && this.convertButton) {
            this.copyButton.addEventListener('click', event => this.copyFromElem(this.outputArea));
            this.prettifyButton.addEventListener('click', event => this.prettifyButtonHandler(this.inputArea, this.outputArea));
            this.pasteButton.addEventListener('click', (event) => this.paste2Elem(this.inputArea));
            this.convertButton.on('click', (event) => this.convertButtonHandler(defConFn2Call));
            this.selectAction?.on('change', (e) => this.onSelectionChangeHandler(e, fn2Call));
        }
        else {
            throw new Error("Cannot find buttons ");
        }
    }
    changeTitles(titleText = '', checkLabel = '') {
        if (!this.checkLabel || !this.title) {
            throw new Error('Checklabel not found');
        }
        this.checkLabel.innerText = checkLabel;
        this.title.innerText = titleText;
    }
    copyFromElem(element) {
        navigator.clipboard.writeText(element.value);
    }
    paste2Elem(element) {
        element.value = '';
        navigator.clipboard.readText().then((text) => {
            element.value = text;
        });
    }
    prettifyButtonHandler(...args) {
        let space = 2;
        args.forEach(elem => {
            elem.value = elem.value.replaceAll(/\\n/g, String.fromCharCode(10));
            elem.value = elem.value.replaceAll(/\\t/g, String.fromCharCode(9));
        });
    }
    convertButtonHandler(fn2Call) {
        this.setInputCache(this.inputArea.value);
        this.outputArea.value = '';
        setTimeout(() => {
            this.outputArea.value = fn2Call(this.inputArea.value);
        }, 100);
    }
    setConvertButtonHandler(fn2Call) {
        this.convertButton?.off();
        this.convertButton?.on('click', (e) => this.convertButtonHandler(fn2Call));
    }
    onSelectionChangeHandler(e, fn2Call) {
        fn2Call(e.currentTarget?.value);
    }
    prepareSelectAction(items) {
        this.selectAction?.empty();
        items.forEach((value, key) => {
            this.selectAction?.append($('<option>', {
                text: key,
                value: value
            }));
        });
        let cache = this.getLocalStorage('action-type');
        if (cache != null) {
            this.selectAction?.val(cache);
        }
    }
    setInputCache(val) {
        try {
            this.setLocalStorage('prev_input', val);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    getInputCache() {
        return this.getLocalStorage('prev_input');
    }
    setLocalStorage(key, val) {
        try {
            localStorage.setItem(key, val);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    getLocalStorage(key) {
        return localStorage.getItem(key);
    }
}

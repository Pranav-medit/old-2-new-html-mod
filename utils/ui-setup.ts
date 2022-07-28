// import $ from 'jquery'
class SetupUI{
  inputArea!:HTMLTextAreaElement ;
  outputArea!: HTMLTextAreaElement ;
  copyButton!: HTMLElement | null;
  convertButton!: JQuery<HTMLButtonElement> | null;
  pasteButton!: HTMLElement | null;
  prettifyButton!: HTMLElement | null;
  isFlatCheckbox!: HTMLElement | null;
  title!: HTMLElement | null;
  checkLabel!: HTMLElement | null;
  selectAction!: JQuery<HTMLSelectElement> | null;
  init(){
    this.inputArea = document.getElementsByClassName('textarea')[0] as HTMLTextAreaElement;
    this.outputArea = document.getElementsByClassName('textarea')[1] as HTMLTextAreaElement;
    this.copyButton = document.getElementById('copy');
    this.convertButton = $('#convert') as JQuery<HTMLButtonElement>;
    this.pasteButton = document.getElementById('paste');
    this.prettifyButton = document.getElementById('pretty');
    this.isFlatCheckbox = document.getElementById('isFlatCheckbox');
    this.title = document.getElementById('title');
    this.checkLabel = document.getElementById('check-label');
    this.selectAction  = $('#select-action') as JQuery<HTMLSelectElement>;
    const cache = this.getInputCache()
    if(cache && cache!=undefined) this.inputArea.innerText = cache;
  }
  addEventListeners(fn2Call: (arg0:string)=>string,defConFn2Call: (arg0:string)=>string){
    if(this.copyButton && this.prettifyButton && this.pasteButton && this.convertButton){
      this.copyButton.addEventListener('click', event => this.copyFromElem(this.outputArea));
      this.prettifyButton.addEventListener('click', event => this.prettifyButtonHandler(this.inputArea,this.outputArea));
      this.pasteButton.addEventListener('click',(event)=> this.paste2Elem(this.inputArea))
      this.convertButton.on('click', (event)=>this.convertButtonHandler(defConFn2Call));
      this.selectAction?.on('change', (e:JQuery.ChangeEvent<HTMLSelectElement, undefined, HTMLSelectElement, HTMLSelectElement>)=>this.onSelectionChangeHandler(e,fn2Call))
    }else{
      throw new Error("Cannot find buttons ")
    }
  }
  changeTitles(titleText='',checkLabel=''){
    // if(!this.checkLabel || !this.title) {console.error('Title or checklabel empty');return;}
    // Set Titles
    // if(document.readyState === "complete") {
    //   // Fully loaded!
    //   if(!this.checkLabel || !this.title) {throw new Error('Checklabel not found');  }
    //   this.checkLabel.innerText = checkLabel
    //   this.title.innerText = titleText
    // }else{
      // window.addEventListener("load", () => {
        if(!this.checkLabel || !this.title) {throw new Error('Checklabel not found');  }
        // DOM ready! Images, frames, and other subresources are still downloading.
        this.checkLabel.innerText = checkLabel
        this.title.innerText = titleText
    // });
    // }
  }
  constructor(fn2Call: (arg0:string)=>string,defConFn2Call:(arg0:string)=>string){
    // Add listeners
    window.onload = ()=> {
      this.init();
      this.addEventListeners(fn2Call,defConFn2Call);
      this.changeTitles();
    };
   
  }
  copyFromElem(element: HTMLTextAreaElement){
    navigator.clipboard.writeText(element.value);
  }
  paste2Elem(element: HTMLTextAreaElement){
    element.value='';
    navigator.clipboard.readText().then((text)=>{
      element.value = text;
    });
  }
  prettifyButtonHandler(...args: HTMLTextAreaElement[]){
    let space = 2
    args.forEach(elem => {
      elem.value = elem.value.replaceAll(/\\n/g,String.fromCharCode(10));
      elem.value = elem.value.replaceAll(/\\t/g,String.fromCharCode(9));
    })
  }
  convertButtonHandler(fn2Call: (arg0: string) => string){
    this.setInputCache(this.inputArea.value); 
    this.outputArea.value='';
    setTimeout(()=>{
        this.outputArea.value = fn2Call(this.inputArea.value)
    },100)
  }
  setConvertButtonHandler(fn2Call:(arg0: string) => string) {
    this.convertButton?.off();
    this.convertButton?.on('click',(e)=> this.convertButtonHandler(fn2Call));
  }
  onSelectionChangeHandler(e:JQuery.ChangeEvent<HTMLSelectElement, undefined, HTMLSelectElement, HTMLSelectElement>,fn2Call: (arg0: string) =>string){
    fn2Call(e.currentTarget?.value)
  }
  prepareSelectAction(items: Map<string,string | number | boolean >){
    this.selectAction?.empty();
    items.forEach((value,key)=>{
      this.selectAction?.append($('<option>', { 
        text : key,
        value: value
      }));
    })
    let cache = this.getLocalStorage('action-type')
    if(cache!=null){
      this.selectAction?.val(cache);
    }
  }
  setInputCache(val: string){
    try{
      this.setLocalStorage('prev_input',val);
      return true;
    }catch(e){
      return false;
    }
  }
  getInputCache(){
    return this.getLocalStorage('prev_input');
  }
  setLocalStorage(key:string,val:string){
    try{
      localStorage.setItem(key,val);
      return true;
    }catch(e){
      return false;
    }
  }
  getLocalStorage(key:string){
      return localStorage.getItem(key);
  }
}

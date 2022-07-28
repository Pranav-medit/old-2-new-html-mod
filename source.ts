// IIFE
// import {SetupUI} from './utils/ui-setup'
(function () {
  let defaultAction = 'show'
  function getNthMapItem<T,U>(mapObj:Map<T,U>,n:number): [T,U]{
    // The key at index n
    var key = Array.from(mapObj.keys())[n] ;                 // Returns key
    // The value of the item at index n
    var val = <U>mapObj.get(key);                             // Returns val
    // // ... or ...
    // var val2 = mapObj.get(Array.from(mapObj.keys())[n]);
    return [key,val]
  }
  function determineAction(compareObj:Map<string,string>,value:string){
    if(value == getNthMapItem<string,string>(compareObj,0)[1]){
      setUpUI.changeTitles('Old 2 new List page','N/A');
      return analyzeResults;
    }else if(value == getNthMapItem<string,string>(compareObj,1)[1]){
      setUpUI.changeTitles('Old 2 new Show page','N/A');
      return generateEntireShowPageHtml; 
    }else{
      setUpUI.changeTitles('Old 2 new Edit page','N/A');
      return (a:string) => a+' '+value+'*';
    }
    return (a:string)=> {return 'kd'}
  }
  let selectionItems = new Map(Object.entries({
    'Old to new List Page': "list",
    'Old to new Show Page': "show",
    'Old to new Edit Page': "edit",
  }));
  const setUpUI:SetupUI = new SetupUI((selectedValue)=> {
    let handleFunction = determineAction(selectionItems,selectedValue);
    setUpUI.setConvertButtonHandler((input)=>handleFunction(input));
    setUpUI.setLocalStorage('action-type',selectedValue);
    return selectedValue;
  },(input)=>{
    let cacheActionType = setUpUI.getLocalStorage('action-type');
    let output = input;
    if(cacheActionType){
      let handleFunction = determineAction(selectionItems,cacheActionType);
      output = handleFunction(input)
    }else{
      output = determineAction(selectionItems,defaultAction)(input);
    }
    return output
  });
  const hET:HtmlTool = new HtmlTool();
  const sH:StringHelper = new StringHelper();
  const oHC:ObjectHelperClass  = new ObjectHelperClass();
  const hF:HtmlFormatter = new HtmlFormatter();
  window.addEventListener("load", ()=> {
    setUpUI.prepareSelectAction(selectionItems);
  });
})(); 
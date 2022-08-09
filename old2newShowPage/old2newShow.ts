
const hET = new HtmlTool();
// const sH = new StringHelper();
// const oHC  = new ObjectHelperClass();
// const hF = new HtmlFormatter();
function wrapWithHeaderHtml(html: string,dto: any,page=false,baseJhi=false) {
    if(!baseJhi){
        baseJhi = extractDto(html)
    }
    if(!page){
        page = seperateCharectersUponUppercase(dto,true) 
    }
  return `
  <div class="bg-white shadow-sm rounded h-full relative" >\n
  <!--Head-->\n
  <div class="flex gap-3 items-center p-3">
    <div class="modal-title" jhiTranslate="${baseJhi}.detail.title">${page} Details</div>
    <button class="btn-dark-blue ml-auto" jhiTranslate="entity.action.edit">Edit ${page}</button>
    <button class="btn-icon-blue" (click)="previousState()">
      <span class="material-icons">close</span>
    </button>
  </div>
  
  <jhi-alert></jhi-alert>
    `+html+'\n</div>';
}

function wrapWithHeaderHtml2(html: string,jhi: any,page:any,ngIf: string='',rl:string = '') {
  return `
  <div ${ngIf} class="bg-white shadow-sm rounded h-full relative" >\n
  <!--Head-->\n
  <div class="flex gap-3 items-center p-3">
    <div class="modal-title" ${jhi}>${page} Details</div>
    <button class="btn-dark-blue ml-auto" jhiTranslate="entity.action.edit" ${rl} >Edit</button>
    <button class="btn-icon-blue" (click)="previousState()">
      <span class="material-icons">close</span>
    </button>
  </div>
  
  <jhi-alert></jhi-alert>
    `+html+'\n</div>';
}

function isPresent(string: string,reg: string | RegExp){
  return string.match(new RegExp(reg)) ? true : false; 
}
function matchNReplace(inputStr: string,regexp: string | RegExp){
  let match:RegExpMatchArray,replacedStr;
  match=<RegExpMatchArray>inputStr.match(new RegExp(regexp))
  if(match == null) console.warn('No match for ', inputStr); ['',inputStr];
  replacedStr = inputStr.replace(<string>match[0],'');
  return [match[0],replacedStr];
}
function getAllTabs(inputStr: any){
  let match;
  // let [match,replacedStr]  = matchNReplace(inputStr,'<ngb-tab[\\s>]+?[\\S\\s\\n.]*?</ngb-tab>')
  let tabArray = []
  while(isPresent(inputStr,'<ngb-tab[\\s>]+?')){
    [ match,inputStr ] = matchNReplace(inputStr,'<ngb-tab[\\s>]+?[\\S\\s\\n.]*?</ngb-tab>') 
    tabArray.push(match);    
  }
  return tabArray;
}
function getAllTr(inputStr: any){
  let trArray = []
  let match;
  while(isPresent(inputStr,'<tr[\\s>]+?')){
    [ match,inputStr ] = matchNReplace(inputStr,'<tr[\\s>]+?[\\S\\s\\n.]*?</tr>') 
    trArray.push(match);    
  }
  return trArray;
}
function extractJhiTranslate(str: string){
  return hET.matchWithErrorHandle(str,`(?<=jhiTranslate\\s*?=\\s*?)".*?"`).slice(1,-1)
}
function extractNgSubValue(str: string){
  return hET.matchWithFlag(str,`(?<={{).*?(?=}})`,'g');
}
function extractNgTabTitle(str: string){
    let a =str.match(new RegExp('(?<=<ngb-tab[\\s.\\n\\S]*?title\\s*?=\\s*?)".*?"'))
  return hET.matchWithErrorHandle(str,'(?<=<ngb-tab[\\s.\\n\\S]*?title\\s*?=\\s*?)".*?"').slice(1,-1)
}
function extractNgIf(str: string){
    return hET.matchWithErrorHandle(str,'\\*ngIf=".*?"');
}
function extractDto(str: string,isInnerStr = false){
    // console.log(str)
    if(isInnerStr){
        return str.trim().split('.').slice(0,-1).join('.').trim()
    }
    return extractJhiTranslate(str).trim().split('.').slice(0,-1).join('.').trim();
}
function extractPlainText(tr:string):string{
  let span = hET.extractHtmlTag(tr,'span');
  return hET.extractHtmlValue(span)
}
function createTrStructureObj(trArray: any[]){
    let trObjArr =  [];
    for(let tr of trArray){
        let trObj:any = {};
        try{
          let subArr = extractNgSubValue(tr);
          if(subArr){
            trObj["subValue"] = subArr[subArr.length-1];
          }
        }catch(err){
          console.log(err);
        }
        try{
          let jhi  = extractJhiTranslate(tr);
          trObj["jhiTranslate"] = jhi;
          if(!jhi || jhi==='') trObj["innerText"] = extractPlainText(tr);
        }catch(err){
          console.log(err);
        }
        try{
          trObj["ngIf"] = extractNgIf(tr);
        }catch(err){
          trObj["ngIf"] = "";
        }
        trObjArr.push(trObj);
    }
    return trObjArr;
}
function createTabStructureObj(str: any){
  let tabStructure = [];
//   if(ngbTabArray.length === 0){
//     // tabStructure
//   }
  let ngbTabArray = getAllTabs(str);
  let tabArr = [];
  for(let ngbTab of ngbTabArray ){
    let tabTitle = extractNgTabTitle(ngbTab);
    let trArray  = getAllTr(ngbTab);
    let trObjArr = createTrStructureObj(trArray);
    tabArr.push({[tabTitle]:trObjArr});
  }
  return tabArr;
}
// let tabStructureArr = createTabStructureObj(compareHtml);
function generateTabHeader(tabStructureArr: any[]){
  
  let html = `<div class="tab-wrapper">\n`
  for(let [i, tabStructure] of tabStructureArr.entries()){
    html+= `\t<a class="tab" [ngClass]="{ active: tabIndex == ${i} }" (click)="tabIndex = ${i}">${Object.keys(tabStructure)[0]}</a>\n`
  }
  return  html+`</div>`
}
function generateTrs(tabStructure: { [x: string]: any; oneTime?: {}[]; }){
    let tabHtml=``;
    for(let tab of tabStructure[Object.keys(tabStructure)[0]]){
        
        try{
          let extractedDtoPartText;
          let removedDtoPartText;
          let textInsider;
          if(tab.jhiTranslate===''){
            textInsider = tab.innerText;
          }else{
            extractedDtoPartText  = extractDto(tab.jhiTranslate,true);
            removedDtoPartText = tab.jhiTranslate.replace(extractedDtoPartText+'.',"");
            textInsider = seperateCharectersUponUppercase(removedDtoPartText,true);
          }
          if(tab.subValue){
  
              tabHtml+=` 
              <div ${tab.ngIf} class="list">
              \t<div jhiTranslate="${tab.jhiTranslate}" class="list-label">${textInsider}</div>
              \t<div class="list-content">{{${tab.subValue}}}</div>
              </div>\n`
          }else{
              tabHtml+=`
              <tr>
                  <td></td>
                  <td class="p-2 text-secondary">
                      <h6 jhiTranslate="${tab.jhiTranslate}">${textInsider}</h6>
                  </td>
              </tr>\n`
          }
        }catch(e){
          console.error(e);
        }
    }
    return tabHtml;
}
function wrapRowDataWithDiv(str: string){
    return `
    <!--- Tab Data -->\n
    <div class="p-3 w-full h-full overflow-auto" [ngStyle]="{ height: 'calc(100% - 130px)' }">\n`+str+`\t</div>\n`
}
function generateTabBody(tabStructureArr: any[]){
  let tabHtml = ``;
  for(let [i, tabStructure] of tabStructureArr.entries()){
    tabHtml+=`\t<!---- TAB ${i+1} ---->\n
  <div *ngIf="tabIndex == ${i}" class="font-medium">\n`
    tabHtml+=generateTrs(tabStructure);
    tabHtml+=`\t</div>\n`
  }
  tabHtml=wrapRowDataWithDiv(tabHtml);
  return tabHtml;
}
// extractDto(compareHtml)
// console.log(generateTabBody(createTabStructureObj(compareHtml)))
function capitalizeFirstLetter(strToCapitalize: string | any[]){
    return strToCapitalize[0].toUpperCase() + strToCapitalize.slice(1);
}
function seperateCharectersUponUppercase(strInput: string,firstCap: boolean){
  try{
      if(firstCap){ 
        return capitalizeFirstLetter(strInput.split(/(?=[A-Z])/).join(' '))
      }
      return strInput.split(/(?=[A-Z])/).join(' ')
    }catch(e){
      console.error(e);
      return ''
    }
  }
function generateShowPageMainBody(htmlText: any){
    let showPageMainBodyHtml = ``;
    if(getAllTabs(htmlText).length ===0){
        let trs = getAllTr(htmlText)
        let createdTrStructureObj = createTrStructureObj(trs)
        let genTrs = generateTrs({oneTime:createdTrStructureObj});
        showPageMainBodyHtml = wrapRowDataWithDiv(genTrs);
    }else{
        showPageMainBodyHtml += generateTabHeader(createTabStructureObj(htmlText)) 
        showPageMainBodyHtml += generateTabBody(createTabStructureObj(htmlText))
    }
    return showPageMainBodyHtml;
}
function dtoExtractorFromDetailDto(str: string){
    return str.split('.').slice(-3,-2).join('');
}
function extractRouterLinkOfEditButton(htmlInput: any){
  let button  = hET.extractHtmlTag(htmlInput, 'button','\\[routerLink\\]');
  let rl = hET.extractAttribute(button,'\\[routerLink\\]');
  return rl;

}
function warnUser2(inputHtml:string,outputHtml:string,regex:string,name:string) {
  if(regex.includes('\\{\\{')){

    let inptArr = inputHtml.match(new RegExp(regex,'g')) as Array<string> 
    let outArr =  outputHtml.match(new RegExp(regex,'g'))as Array<string> 
    console.log(inptArr,outArr)
    for(let ia of inptArr) {
      if(! outArr.includes(ia) ){
        console.log(ia)
      }
    }
    console.log(inptArr,outArr)
  }
  try{
    
    let inputCounts = htmlExtractTool.getMatchCounts(inputHtml,regex);
    let outputCounts = htmlExtractTool.getMatchCounts(outputHtml,regex);
    if(inputCounts !== outputCounts){
        console.error(`${name} input has '${inputCounts}' count and output has '${outputCounts}'`)
    }else{
        console.info(name+" is fine",inputCounts,outputCounts)
    }
}catch(e){
    console.warn(name+"skipped due to error",e)
}
}
function generateEntireShowPageHtml(htmlText: any){
    let html =``;
    html = generateShowPageMainBody(htmlText);
    let  h6 = hET.extractHtmlTag2(htmlText,'h6').trim();
    let jhiVal = hET.extractAttributeValue( hET.extractAttribute(h6,'jhiTranslate'));
    let firstNgIf = hET.extractAttribute(htmlText,'\\*ngIf')
    let rl = extractRouterLinkOfEditButton(htmlText);
    html = wrapWithHeaderHtml2(html,hET.extractAttribute(h6,'jhiTranslate'),seperateCharectersUponUppercase(dtoExtractorFromDetailDto(jhiVal),true),firstNgIf,rl);
    warnUser2(htmlText,html,'\\{\\{[\\s\\S\\n.]*?\\}\\}','{{......}}');
    warnUser2(htmlText,html,'\\*ngIf','NGIF')
    warnUser2(htmlText,html,'BASE_URL','Base url')
    warnUser2(htmlText,html,'\\*ngFor','NG for')
    return html;
}
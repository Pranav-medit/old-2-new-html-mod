let jhiData: any;
$.ajax({
  url: "./assets/en.json",
  async: false,
  success: function (res) {
    jhiData = res;
  },
  error: function () {
    alert("An error was encountered.");
  },
});

let htmlExtractTool = new HtmlTool();
let sH = new StringHelper();
const oHC  = new ObjectHelperClass();
const htmlFormatter = new HtmlFormatter();

function wrapWithTag(value="",_class="",eAttr="",tag="div"){
  let nl ='\n'
  if(eAttr === "" && _class!=="") return `<${tag} class="${_class}" ${eAttr}>\n\t${value}\n</${tag}>`
  return `<${tag} ${eAttr}>\n\t${value}\n</${tag}>`;
}
function genPageHeader(jhi: any) {
  let exJhiAttr = htmlExtractTool.extractAttribute(jhi, "jhiTranslate");
  let exJhiVal = htmlExtractTool.extractAttributeValue(exJhiAttr);
  return `<div ${jhi} class="page-head">
      ${oHC.getObjectValue(jhiData, exJhiVal)}
  </div>`;
}
function genPageHeaderButtons(compareHtml: any,showFilter: boolean){
    let buttonDiv = htmlExtractTool.extractHtmlTag2(compareHtml,'div','class="col-.*? text-right')
    let buttonsHtml = ` <button class="btn-light-blue" (click)="showFilters = !showFilters">
    {{ showFilters ? 'Hide ' : 'Show ' }} Filters
    <span class="material-icons text-lg align-middle leading-5 ml-1">filter_alt</span>
  </button>`;
    if(!showFilter) buttonsHtml = '';
    if(!buttonDiv && showFilter) return wrapWithTag(buttonsHtml,'','class="flex justify-end gap-3 items-center p-3"')
    if(!buttonDiv) return buttonsHtml
    let buttons = htmlExtractTool.extractAllTagWithAttr(buttonDiv,'button');
    for(let button of buttons){
        button = htmlExtractTool.removeAttribute(button, 'class');
        button = htmlExtractTool.addAttribute(button,'class="btn-dark-blue"')
        button = cleanSpanButton(button);
        buttonsHtml+=button;
    }
    let wrapButton  = wrapWithTag(buttonsHtml,'','class="flex justify-end gap-3 items-center p-3"')
    return wrapButton
}
function genPageHeaderButtons2(compareHtml: any,showFilter: boolean){
    let buttonDiv = htmlExtractTool.extractHtmlTag2(compareHtml,'div','class="col-.*? text-right')
    let buttonsHtml = ``;
    if(!buttonDiv) return buttonsHtml
    let buttons = htmlExtractTool.extractAllTagWithAttr(buttonDiv,'button');
    buttons.forEach((button,index)=>{
        button = htmlExtractTool.removeAttribute(button, 'class');
        if(index === 0){
            button = htmlExtractTool.addAttribute(button,'class="btn-light-blue"')
        }else{
            button = htmlExtractTool.addAttribute(button,'class="btn-dark-blue"')
        }
        button = cleanSpanButton(button);
        buttonsHtml+=button;
    })
    let wrapButton  = wrapWithTag(buttonsHtml,'','class="flex gap-3"')
    return wrapButton
}
// wrapWithTag("w-full",value)
// wrapWithTag("page-body",value)
// wrapWithTag("flex w-1/2 gap-2",value)
// wrapWithTag("flex justify-between items-center p-3",value)

// wrapWithTag("flex gap-3",value)
// wrapWithTag("p-3",value)
// wrapWithTag("paginator-container",value)
function indentAllLines(text: string,noOfIndentations=1){
    return text.replaceAll(/^/gm,'\t'.repeat(noOfIndentations))
}
let inputCount=0,selectCount = 0;
function generateSearchForm(compareHtml: any){
    selectCount = 0;
    inputCount = 0;
    let formTag = htmlExtractTool.extractHtmlTag(compareHtml, "form", "searchForm");
    if(!formTag) return '';
    let divs = htmlExtractTool.extractAllTagWithAttr(formTag, "div", "col-2");
    let attrArr=[];
    let html = ``
    for (let div of divs) {
      let input = htmlExtractTool.extractHtmlTag(div, "(input)", "", true);
      let select = htmlExtractTool.extractHtmlTag(div,"select")
      if(!input && !select) continue;
      else if(input)  {
        inputCount++;
         html+= handleInput(input,'i')
      }
      else if(select)   {
        selectCount++;
         html+= handleInput(select,'s')
      }
      else console.warn("something is different",input)
    }
    return html;
}
function genTheadRow(jhi: string | null){
    let attrVal = htmlExtractTool.extractAttributeValue(jhi);
    return indentAllLines(`<th ${jhi}>${oHC.getObjectValue(jhiData,attrVal)}</th>\n`)
}
function genThRows(compareHtml: any){
    let table = htmlExtractTool.extractHtmlTag(compareHtml, "table");
    let thead = htmlExtractTool.extractHtmlTag(table, "thead");
    let thRows = htmlExtractTool.extractAllTagWithAttr(thead, "th");
    let html =``
    for(let thRow of thRows){
        let jhi = htmlExtractTool.extractAttribute(thRow,'jhiTranslate');
        let ngIf = htmlExtractTool.extractAttribute(thRow,'\\*ngIf')
        if(jhi){
            let eachRow = genTheadRow(jhi)
            if(ngIf){
             htmlExtractTool.addAttribute(thRow,ngIf)   
            }
            html+= eachRow;
        }else{
            html+=thRow;
        }
    }
    // html+=`\t<th>Actions</th>`
    html = wrapWithTag(html,'','','tr')
    html = wrapWithTag(html,'','','thead')
    return html;
}
function cleanSpanButton(html: { replace: (arg0: boolean | RegExp, arg1: any) => string; }){
    let span =htmlExtractTool.extractHtmlTag(html,'span')
    if(!span) return html
    let jhi = htmlExtractTool.extractAttribute(span,'jhiTranslate');
    let authority = htmlExtractTool.extractAttribute(span,'\\*jhiHasAnyAuthority')
    let jhiVal = htmlExtractTool.extractAttributeValue(jhi);
    let repl = htmlExtractTool.replaceWithErrorHandle(html,'',"",span);
    repl = htmlExtractTool.replaceValueOfTag(repl,oHC.getObjectValue(jhiData,jhiVal));
    if(authority) repl= htmlExtractTool.addAttribute(repl,authority);
    return htmlExtractTool.addAttribute(repl,jhi)+'\n';
}
function genTbRows(compareHtml: any){
    let table = htmlExtractTool.extractHtmlTag(compareHtml, "table");
    let tbody = htmlExtractTool.extractHtmlTag(table, "tbody");
    let ngIfNoRes = htmlExtractTool.matchWithErrorHandle(tbody,'<tr[\\n\\s.]*?\\*ngIf="![.\\s\\S\\n]*?</tr>')
    let ngif= htmlExtractTool.extractAttribute(ngIfNoRes,'\\*ngIf')
    let tr = htmlExtractTool.extractHtmlTag(tbody, "tr","\\*ngFor=");
    let ngFor = htmlExtractTool.extractAttribute(tr,'\\*ngFor')
    let click = htmlExtractTool.extractAttribute(tr,'\\(click\\)')
    let tdRows = htmlExtractTool.extractAllTagWithAttr(tr, "td");
    // console.log(thRows)
    let html =``
    let noResHtml = ``
    for(let tdRow of tdRows){
        if(htmlExtractTool.isPresent(tdRow,'<div[.\\n\\S\\s]*?<button')){
            let buttons  = htmlExtractTool.extractAllTagWithAttr(tdRow,'button')
            let buttonsHtml  = ``;
            for(let button of buttons){
                button = htmlExtractTool.removeAttribute(button,'type')
                button = htmlExtractTool.removeAttribute(button,'class')
                button =  htmlExtractTool.addAttribute(button,'class="link"')
                button = cleanSpanButton(button);
                buttonsHtml+=button;
            }
            buttonsHtml = wrapWithTag(buttonsHtml,'flex items-center gap-2') 
            
            buttonsHtml =wrapWithTag(buttonsHtml,'','','td')
            html+=buttonsHtml
        }else{
            if(tdRow.includes('noResultsFound')){
                noResHtml+=wrapWithTag(tdRow,'',ngif,'tr');
            }else{
                html+= tdRow;
            }
        }
        // let jhi = htmlExtractTool.extractAttribute(thRow,'jhiTranslate');
        // if(jhi){
        //     html+= genTheadRow(jhi);
        // }
    }
    if(click){
        html = wrapWithTag(html,'',ngFor+''+click,'tr')
    }else{
        html = wrapWithTag(html,'',ngFor,'tr')
    }
    if(noResHtml){
        html+=noResHtml;
    }
    html = wrapWithTag(html,'','','tbody')
    return html;
}
// console.log(genTbRows(compareHtml))
function generateTableWithPag(compareHtml: any){
    let html = ``;
    html+= genThRows(compareHtml)
    html+= genTbRows(compareHtml)
    html = wrapWithTag(html,'table-box','','table')+'\n' 
    html+=generatePaginator(getLastNgIf(compareHtml))
    html = '\n<!---TABLE-->\n'+wrapWithTag(html,'p-3')
    return html

}
function genPage(compareHtml: any){
    let html=``;
    let firstH6 = htmlExtractTool.extractHtmlTag(compareHtml, "h6")
    let jhi = htmlExtractTool.extractAttribute(firstH6,'jhiTranslate');
    let header = genPageHeader(jhi)
    let sf = generateSearchForm(compareHtml);
    if(sf!=='') { 
        html +=  sf;
        html = addSrchNClrButtons(html); 
        html = indentAllLines(html);
        html = wrapWithTag(html,'',"class='flex flex-wrap items-center p-3 gap-4 border-t' *ngIf='showFilters'")
    }
    html += `\n<jhi-alert></jhi-alert>\n`
    html+= generateTableWithPag(compareHtml);
    html=genPageHeaderButtons(compareHtml,true)+html;
    html = `<!---HEAD-->\n`+html;
    html = wrapWithTag(html,"page-body")
    html = header+'\n'+html;
    html = wrapWithTag(html,'w-full')
    return html.trim();
}
function oneLineSearchPage(compareHtml: any,header: string,sf: string){
    let html=``;
    if(sf!=='') { 
        html +=  sf;
        html = addSrchNClrButtons(html); 
        html = indentAllLines(html);
        html = wrapWithTag(html,'',"class='flex w-1/2 gap-2'")
    }
    html= html+genPageHeaderButtons2(compareHtml,true);
    html = wrapWithTag(html,'','class="flex justify-between items-center p-3"')
    html += `\n<jhi-alert></jhi-alert>\n`
    html+= generateTableWithPag(compareHtml);
    html = `<!---HEAD-->\n`+html;
    html = wrapWithTag(html,"page-body")
    html = header+'\n'+html;
    html = wrapWithTag(html,'w-full')
    return html.trim();
}
function showFilterSearchPage(compareHtml: any,header: string,sf: string){
    let html=``;
    if(sf!=='') { 
        html +=  sf;
        html = addSrchNClrButtons(html); 
        html = indentAllLines(html);
        html = wrapWithTag(html,'',"class='flex flex-wrap items-center p-3 gap-4 border-t' *ngIf='showFilters'")
    }
    html += `\n<jhi-alert></jhi-alert>\n`
    html+= generateTableWithPag(compareHtml);
    html=genPageHeaderButtons(compareHtml,true)+html;
    html = `<!---HEAD-->\n`+html;
    html = wrapWithTag(html,"page-body")
    html = header+'\n'+html;
    html = wrapWithTag(html,'w-full')
    return html.trim();
}
function genPage2(compareHtml: any){
    let html=``;
    let firstH6 = htmlExtractTool.extractHtmlTag(compareHtml, "h6")
    let jhi = htmlExtractTool.extractAttribute(firstH6,'jhiTranslate');
    let header = genPageHeader(jhi)
    let sf = generateSearchForm(compareHtml);
    let counts = inputCount+selectCount;
    if(counts>4){
        html =showFilterSearchPage(compareHtml,header,sf);
    }else{
        html = oneLineSearchPage(compareHtml,header,sf);
    }
    return html;
}
// console.log(genPage(compareHtml).trim());

function getLastNgIf(html: string){
    let regexp  =new RegExp(`\\*ngIf=".*?"(?=[.\\s\\n]*?style="background-color: #f8f9fa;")`)
    let ngif = htmlExtractTool.extractAttribute(htmlExtractTool.matchWithErrorHandle(html,regexp),'\\*ngIf')
    return ngif;
}
// console.log(generateTableWithPag(compareHtml))
// console.log(htmlExtractTool.extractAttribute(compareHtml,'\\*ngIf[.\\s\\S\\n]*(?=background-color: #f8f9fa)'))
// console.log()

function generatePaginator(ngIf: any) {
    return `<div class="paginator-container" ${ngIf} >
          <mat-paginator
            [length]="totalItems"
            [pageSize]="itemsPerPage"
            [pageIndex]="page"
            [pageSizeOptions]="[5, 10, 15, 25, 50]"
            [showFirstLastButtons]="true"
            (page)="loadPage($event)"
          >
          </mat-paginator>
        </div>`
}
// console.log(htmlExtractTool.extractAttribute(compareHtml,'\\*ngIf','',true))


function handleInput(input: string | undefined,type: string) {
    input = htmlExtractTool.removeAttribute(input,'class');
    input = htmlExtractTool.removeAttribute(input,'type');
    if(input?.toLowerCase().includes('date')){
        input =  htmlExtractTool.addAttribute(input,'type="date"')
    } else{
        input = htmlExtractTool.addAttribute(input,'type="search"')
    }
    input = wrapWithTag(input,"",`type="search" class="search-box"` )
    return input+'\n';
}
function addSrchNClrButtons(html: string){
    return html+`
<button class="btn-dark-blue" (click)="search()">Search</button>\n
<button class="link" (click)="clear()" *ngIf="currentSearch">Clear</button>\n`
}

function generateEntireListPageHtml(htmlText: any) {
  let html = ``;
  return html;
}
function warnUser(regex: string ,input: string,output: string,name: string){
    try{
        let inputCounts = htmlExtractTool.getMatchCounts(input,regex);
        let outputCounts = htmlExtractTool.getMatchCounts(output,regex);6
        if(regex.includes('jhiTranslate')){
            inputCounts-=7
        }
        if(inputCounts !== outputCounts){
            console.error(`Input ${name} input count has ${inputCounts} and output count has ${outputCounts}`)
        }else{
            console.info(name+" is fine",inputCounts,outputCounts)
        }
    }catch(e){
        console.warn(name+"skipped due to error",e)
    }
}
function compare(input: string,output: string){
    warnUser('jhiTranslate="',input,output,'JHI Translate')
    warnUser('\\*jhiHasAnyAuthority',input,output,'JHI Has authority')
    warnUser('\\*ngIf',input+"*ngIf",output,'Ng If')
    warnUser('\\*ngFor',input,output,'Ng For')
    warnUser('\\[routerLink\\]',input,output,'Router link')
    warnUser('\\(click\\)',input,output,'Click')
    warnUser('\\[\\(ngModel\\)\\]',input,output+'[(ngModel)]','Ng model')
    warnUser('formControl',input,output,'Form control')
    
}
function analyzeResults(input: any){
    let pageHtml = genPage2(input);
    compare(input,pageHtml)
    return htmlFormatter.formatHTML(pageHtml.trim());
}


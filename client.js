window.__ModuleLoader__.load({
  id: 'dsh-agentsmd-manager',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const { useEffect, useMemo, useRef, useState } = React;
    const API = '/api/dsh-agentsmd-manager/';
    const copy = {
      zh: { title:'AGENTS.md 管理', sub:'在一个位置管理所有工作区的指令文件', search:'搜索项目、路径或内容', global:'全局指令', templates:'模板', newTemplate:'新建模板', refresh:'刷新', noProjects:'尚无已注册工作区', noFiles:'这里还没有 AGENTS.md', newRoot:'新建根目录 AGENTS.md', batchPreview:'批量预览', edit:'编辑', preview:'预览', diff:'变更预览', save:'保存文件', saving:'保存中…', saved:'已保存', ai:'AI 帮我修改', prompt:'描述希望如何修改', generate:'生成建议', accept:'采用建议', discard:'放弃建议', model:'模型', sent:'将发送当前草稿、用户要求及可用的 README/项目清单到所选模型', templateName:'模板名称', templateBody:'模板内容', addTemplate:'保存模板', apply:'应用', replace:'替换全文', insert:'插入光标处', remove:'删除', cancel:'取消', back:'返回', empty:'未找到匹配内容', conflict:'文件已在外部修改，请刷新后重新比较。', original:'磁盘原文', proposed:'当前草稿', readOnly:'只读预览', missing:'文件尚不存在', choose:'选择一个工作区或文件', chooseTemplate:'选择模板或点击 + 新建', loading:'正在读取…', discardChanges:'有未保存的修改。放弃修改并离开吗？', deleteTemplate:'确定删除这个模板吗？' },
      en: { title:'AGENTS.md Manager', sub:'Manage workspace instructions in one place', search:'Search projects, paths, or content', global:'Global instructions', templates:'Templates', newTemplate:'New template', refresh:'Refresh', noProjects:'No registered workspaces', noFiles:'No AGENTS.md files here', newRoot:'Create root AGENTS.md', batchPreview:'Preview all', edit:'Edit', preview:'Preview', diff:'Review changes', save:'Save file', saving:'Saving…', saved:'Saved', ai:'Edit with AI', prompt:'Describe the change you want', generate:'Generate suggestion', accept:'Use suggestion', discard:'Discard suggestion', model:'Model', sent:'The draft, your request, and available README/project manifests will be sent to the selected model', templateName:'Template name', templateBody:'Template content', addTemplate:'Save template', apply:'Apply', replace:'Replace entire file', insert:'Insert at cursor', remove:'Delete', cancel:'Cancel', back:'Back', empty:'No matching content', conflict:'This file changed outside the plugin. Refresh and compare before saving.', original:'On disk', proposed:'Current draft', readOnly:'Read-only preview', missing:'File does not exist yet', choose:'Choose a workspace or file', chooseTemplate:'Choose a template or click + to add one', loading:'Loading…', discardChanges:'You have unsaved changes. Discard them and leave?', deleteTemplate:'Delete this template?' }
    };
    const css = `
.am {
  --text:#263548;--secondary:#5F7082;--quiet:#788696;
  --bg:#F8FAFC;--rail:#EEF2F6;--card:#FFFFFF;--border:#D7E0E9;
  --accent:#5C7FA6;--action:#4F7298;--selected:#DEE7F2;--hover:#E8EEF5;
  height:100%;display:flex;flex-direction:column;color:var(--text);background:var(--bg);font:14px/1.5 system-ui,sans-serif
}
.am.am-dark{
  --text:#E7EEF5;--secondary:#A6B7C8;--quiet:#A6B7C8;
  --bg:#151C24;--rail:#1D2732;--card:#263340;--border:#38495B;
  --accent:#8AA9CA;--action:#496D94;--selected:#2B3F54;--hover:#253748
}
.am *{box-sizing:border-box}
.am button,.am input,.am textarea,.am select{font:inherit}
.am button{cursor:pointer}
.am button:disabled{opacity:.48;cursor:not-allowed}
.am button:focus-visible,.am input:focus-visible,.am textarea:focus-visible,.am select:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.am-head{padding:24px 30px 18px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;gap:20px}
.am h1{font-size:22px;line-height:1.2;margin:0;font-weight:650;letter-spacing:-.025em}
.am-sub,.am-muted{color:var(--secondary)}
.am-sub{margin-top:5px}
.am-main{min-height:0;flex:1;display:grid;grid-template-columns:275px minmax(0,1fr)}
.am-rail{overflow:auto;border-right:1px solid var(--border);padding:18px 12px;background:var(--rail)}
.am-work{overflow:auto;padding:24px 30px}
.am-search,.am-field,.am-text,.am select{width:100%;padding:10px 12px;border:1px solid var(--border);border-radius:10px;color:var(--text);background:var(--card)}
.am-search::placeholder,.am-field::placeholder,.am-text::placeholder{color:var(--secondary);opacity:1}
.am-search{margin-bottom:20px}
.am-label{font-size:12px;letter-spacing:.06em;color:var(--secondary);font-weight:650;margin:16px 10px 7px}
.am-section{display:flex;align-items:center;justify-content:space-between;margin:16px 10px 7px}
.am-section .am-label{margin:0}
.am-add{border:0;border-radius:7px;background:transparent;color:var(--text);font-size:20px!important;line-height:1;width:26px;height:26px}
.am-add:hover:not(:disabled),.am-add.on{background:var(--selected)}
.am-row{display:block;width:100%;border:0;text-align:left;background:transparent;color:var(--text);border-radius:10px;padding:10px 11px}
.am-row:hover:not(:disabled){background:var(--hover)}
.am-row.on{background:var(--selected);font-weight:600}
.am-workspace-name{color:var(--text);font-size:14px;font-weight:650;line-height:1.4}
.am-path{font-size:12px;font-weight:400;color:var(--secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.am-actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.am-btn{min-height:36px;border:1px solid var(--border);border-radius:9px;padding:7px 12px;background:var(--card);color:var(--text);font-weight:600;transition:background-color .15s ease,border-color .15s ease}
.am-btn:hover:not(:disabled){background:var(--selected);border-color:var(--accent)}
.am-btn.primary{background:var(--action);color:#fff;border-color:var(--action)}
.am-btn.primary:hover:not(:disabled){filter:brightness(.92);background:var(--action)}
.am-titlebar{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:20px}
.am-titlebar h2{font-size:18px;margin:0;color:var(--text);font-weight:650}
.am-files{max-width:760px}
.am-file{border:1px solid var(--border);border-radius:12px;padding:14px 16px;margin:9px 0;display:flex;justify-content:space-between;gap:16px;align-items:center;background:var(--card);color:var(--text)}
.am-file.am-row{display:flex}
.am-file strong{color:var(--text);font-weight:650}
.am-file span{color:var(--accent)}
.am-file:hover:not(:disabled){border-color:var(--accent);background:var(--card)}
.am-editor{display:flex;flex-direction:column;gap:13px;height:100%;min-height:420px}
.am-text{min-height:350px;flex:1;resize:vertical;line-height:1.55;font-family:var(--dsh-code-font-family,ui-monospace,monospace)}
.am-preview{border:1px solid var(--border);border-radius:12px;padding:20px;overflow:auto;min-height:280px;white-space:normal;background:var(--card)}
.am-preview h1,.am-preview h2,.am-preview h3{margin:14px 0 8px;color:var(--text)}
.am-preview p{margin:7px 0}
.am-preview code,.am-preview pre{font-family:ui-monospace,monospace}
.am-preview pre{white-space:pre-wrap;background:var(--selected);padding:12px;border-radius:8px}
.am-diff{display:grid;grid-template-columns:1fr 1fr;gap:12px;min-height:250px}
.am-diff pre{margin:0;white-space:pre-wrap;overflow-wrap:anywhere;max-height:55vh;overflow:auto;border:1px solid var(--border);padding:14px;border-radius:10px;color:var(--text);background:var(--card)}
.am-panel{border:1px solid var(--border);padding:16px;border-radius:12px;margin-top:14px;display:grid;gap:12px;background:var(--card)}
.am-alert{padding:10px 12px;border-radius:9px;background:var(--selected);color:var(--text)}
.am-empty{padding:32px 16px;color:var(--secondary);text-align:center}
.am-back{display:none;margin-bottom:12px}
.am-back.file{display:flex}
@media(max-width:760px){.am-head{padding:18px}.am-main{display:block}.am-rail,.am-work{height:100%}.am-work{padding:18px}.am-main.detail .am-rail{display:none}.am-main:not(.detail) .am-work{display:none}.am-back{display:flex}.am-diff{grid-template-columns:1fr}}
    `;
    async function api(route, body = {}, signal) {
      const response = await fetch(API + route, { method:'POST', cache:'no-store', signal, headers:{ 'content-type':'application/json', 'x-dsh-agentsmd-manager':'1' }, body:JSON.stringify(body) });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || `HTTP ${response.status}`);
      return data.data;
    }
    function md(text) {
      const nodes=[]; let code=[];
      String(text).split('\n').forEach((line,i)=>{
        if (line.startsWith('```')) { if(code.length){nodes.push(h('pre',{key:i},code.join('\n')));code=[]} else code.push(''); return; }
        if(code.length){code.push(line);return}
        const heading=/^(#{1,3})\s+(.+)$/.exec(line);
        if(heading){nodes.push(h('h'+heading[1].length,{key:i},heading[2]));return}
        if(/^[-*]\s/.test(line)){nodes.push(h('p',{key:i},'• '+line.slice(2)));return}
        nodes.push(h('p',{key:i},line||'\u00a0'));
      });
      return nodes;
    }
    function Icon() { return h('svg',{width:18,height:18,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.8},h('path',{d:'M5 3h10l4 4v14H5z M15 3v5h4 M8 12h8 M8 16h8'})); }
    function hostIsDark() {
      const value=getComputedStyle(document.documentElement).getPropertyValue('--dsw-alias-bg-base').trim();
      let rgb;
      if (/^#[\da-f]{6}$/i.test(value)) rgb=[1,3,5].map(i=>parseInt(value.slice(i,i+2),16));
      else if (/^#[\da-f]{3}$/i.test(value)) rgb=[1,2,3].map(i=>parseInt(value[i]+value[i],16));
      else if (/^rgba?\(/i.test(value)) rgb=(value.match(/[\d.]+/g)||[]).slice(0,3).map(Number);
      if (rgb?.length===3) return (rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722)<128;
      return matchMedia('(prefers-color-scheme: dark)').matches;
    }
    function Page() {
      const lang=(document.documentElement.lang||navigator.language||'en').toLowerCase().startsWith('zh')?'zh':'en'; const t=copy[lang];
      const [inventory,setInventory]=useState(null),[route,setRoute]=useState({kind:'home'}),[file,setFile]=useState(null),[draft,setDraft]=useState(''),[query,setQuery]=useState(''),[results,setResults]=useState(null),[tab,setTab]=useState('edit'),[panel,setPanel]=useState(''),[templates,setTemplates]=useState([]),[models,setModels]=useState([]),[model,setModel]=useState(''),[prompt,setPrompt]=useState(''),[suggestion,setSuggestion]=useState(null),[templateName,setTemplateName]=useState(''),[templateBody,setTemplateBody]=useState(''),[templateBase,setTemplateBase]=useState(null),[applyTemplate,setApplyTemplate]=useState(''),[batch,setBatch]=useState(null),[busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
      const editor=useRef(null),requestController=useRef(null),openRequest=useRef(0);
      const [dark,setDark]=useState(hostIsDark);
      const button=(label,fn,kind='',disabled=false)=>h('button',{type:'button',className:'am-btn '+kind,onClick:fn,disabled},label);
      const load=async()=>{setBusy(true);setError('');try{const [items,ts,ms]=await Promise.all([api('list'),api('templates'),api('models').catch(()=>[])]);setInventory(items);setTemplates(ts);setModels(ms);if(ms.length&&!model)setModel(ms[0].provider+'::'+ms[0].model)}catch(e){setError(e.message)}finally{setBusy(false)}};
      useEffect(()=>{load()},[]);
      useEffect(()=>{const update=()=>setDark(hostIsDark());const timer=setInterval(update,800);update();return()=>clearInterval(timer)},[]);
      useEffect(()=>{let active=true;const q=query.trim();if(!q){setResults(null);return}const timer=setTimeout(()=>api('search',{query:q}).then(x=>{if(active)setResults(x)}).catch(e=>{if(active)setError(e.message)}),250);return()=>{active=false;clearTimeout(timer)}},[query]);
      const target=route.kind==='file'?route.target:null;
      const selected=route.kind==='workspace'?route.workspaceId:route.kind==='global'?'global':target?(target.scope==='global'?'global':target.workspaceId):null;
      const dirty=route.kind==='file'?(draft!==file?.content||suggestion!==null):route.kind==='template'||route.kind==='template-new'?(templateName!==templateBase?.name||templateBody!==templateBase?.content):false;
      const canLeave=()=>!dirty||window.confirm(t.discardChanges);
      const navigate=next=>{if(!canLeave())return;openRequest.current++;requestController.current?.abort();setRoute(next);setPanel('');setSuggestion(null);setError('');setNotice('')};
      const back=()=>navigate(route.kind==='file'?(target.scope==='global'?{kind:'global'}:{kind:'workspace',workspaceId:target.workspaceId}):{kind:'home'});
      const open=async next=>{if(!canLeave())return;const request=++openRequest.current;setBusy(true);setError('');setNotice('');try{const value=await api('read',{target:next});if(request!==openRequest.current)return;requestController.current?.abort();setRoute({kind:'file',target:next});setFile(value);setDraft(value.content);setPanel('');setSuggestion(null);setTab('edit')}catch(e){if(request===openRequest.current)setError(e.message)}finally{if(request===openRequest.current)setBusy(false)}};
      const save=async()=>{if(tab!=='diff'){setTab('diff');return}setBusy(true);setError('');try{const value=await api('save',{target,content:draft,expectedVersion:file.version});setFile(value);setNotice(t.saved);setTab('edit');await load()}catch(e){setError(e.message.includes('Conflict')?t.conflict:e.message)}finally{setBusy(false)}};
      const showTemplate=item=>{if(!canLeave())return;openRequest.current++;requestController.current?.abort();setTemplateName(item?.name||'');setTemplateBody(item?.content||'');setTemplateBase({name:item?.name||'',content:item?.content||''});setRoute(item?{kind:'template',id:item.id}:{kind:'template-new'});setError('');setNotice('')};
      const saveTemplate=async()=>{setBusy(true);setError('');try{const item=await api('template/save',{...(route.kind==='template'?{id:route.id}:{}),name:templateName,content:templateBody});setTemplates(await api('templates'));setTemplateBase({name:item.name,content:item.content});setRoute({kind:'template',id:item.id});setNotice(t.saved)}catch(e){setError(e.message)}finally{setBusy(false)}};
      const removeTemplate=async()=>{if(!window.confirm(t.deleteTemplate))return;setBusy(true);setError('');try{await api('template/delete',{id:route.id});setTemplates(await api('templates'));setRoute({kind:'home'});setTemplateBase(null)}catch(e){setError(e.message)}finally{setBusy(false)}};
      const generate=async()=>{const [provider,chosen]=model.split('::');const controller=new AbortController();requestController.current=controller;setBusy(true);setError('');try{const result=await api('suggest',{target,draft,prompt,provider,model:chosen},controller.signal);if(!controller.signal.aborted){setSuggestion(result.content);setTab('diff')}}catch(e){if(e.name!=='AbortError')setError(e.message)}finally{if(requestController.current===controller)requestController.current=null;setBusy(false)}};
      const previewAll=async()=>{setBusy(true);setError('');try{setBatch({selected,files:await api('preview',globalPicked?{scope:'global'}:{scope:'workspace',workspaceId:selected})})}catch(e){setError(e.message)}finally{setBusy(false)}};
      const rows=inventory?.workspaces||[];
      const picked=rows.find(w=>w.id===selected);
      const globalPicked=selected==='global';
      const fileRows=globalPicked?inventory?.global.map(g=>({relativePath:g.path,target:g.target,exists:g.exists})):(picked?.files||[]);
      const templatePicked=route.kind==='template'||route.kind==='template-new';
      const renderTemplate = () => h('div',{className:'am-editor'},
        h('div',{className:'am-titlebar'},h('h2',null,route.kind==='template-new'?t.newTemplate:t.templates)),
        h('input',{className:'am-field',placeholder:t.templateName,value:templateName,onChange:e=>setTemplateName(e.target.value),'aria-label':t.templateName}),
        h('textarea',{className:'am-text',placeholder:t.templateBody,value:templateBody,onChange:e=>setTemplateBody(e.target.value),'aria-label':t.templateBody}),
        h('div',{className:'am-actions'},button(t.addTemplate,saveTemplate,'primary',busy||!templateName.trim()||!dirty),route.kind==='template'&&button(t.remove,removeTemplate,'',busy)));
      return h('div',{className:'am'+(dark?' am-dark':'')},h('style',null,css),
        h('header',{className:'am-head'},h('div',null,h('h1',null,t.title),h('div',{className:'am-sub'},t.sub)),button(t.refresh,load,'',busy)),
        h('div',{className:'am-main '+(route.kind!=='home'?'detail':'')},
          h('aside',{className:'am-rail'},h('input',{className:'am-search',type:'search',placeholder:t.search,value:query,onChange:e=>setQuery(e.target.value),'aria-label':t.search}),
            h('button',{className:'am-row '+(selected==='global'?'on':''),onClick:()=>navigate({kind:'global'})},t.global),
            h('div',{className:'am-label'},`Workspaces · ${rows.length}`),rows.length?rows.map(w=>h('button',{key:w.id,className:'am-row '+(selected===w.id?'on':''),onClick:()=>navigate({kind:'workspace',workspaceId:w.id})},h('div',{className:'am-workspace-name'},w.title||w.path),h('div',{className:'am-path',title:w.path},w.path))):h('div',{className:'am-empty'},busy?t.loading:t.noProjects),
            h('div',{className:'am-section'},h('div',{className:'am-label'},t.templates),h('button',{type:'button',className:'am-add '+(route.kind==='template-new'?'on':''),onClick:()=>showTemplate(null),'aria-label':t.newTemplate,title:t.newTemplate},'+')),
            templates.map(item=>h('button',{key:item.id,className:'am-row '+(route.kind==='template'&&route.id===item.id?'on':''),onClick:()=>showTemplate(item)},item.name))),
          h('main',{className:'am-work'},
            route.kind!=='home'&&h('div',{className:'am-actions am-back '+(route.kind==='file'?'file':'')},button('← '+t.back,back)),
            error&&h('div',{className:'am-alert',role:'alert'},error),notice&&h('div',{className:'am-alert',role:'status'},notice),
            templatePicked?renderTemplate():
            target? h('div',{className:'am-editor'},h('div',{className:'am-titlebar'},h('div',null,h('h2',null,target.scope==='global'?inventory.global[target.index].path:target.relativePath),h('div',{className:'am-path'},picked?.path||t.global)),h('div',{className:'am-actions'},button(t.edit,()=>setTab('edit')),button(t.preview,()=>setTab('preview')),button(t.diff,()=>setTab('diff')))),
              tab==='edit'?h('textarea',{ref:editor,className:'am-text',value:draft,onChange:e=>setDraft(e.target.value),'aria-label':t.edit,spellCheck:false}):tab==='preview'?h('div',{className:'am-preview'},md(draft)):h('div',{className:'am-diff'},h('div',null,h('strong',null,t.original),h('pre',null,file?.content||'')),h('div',null,h('strong',null,t.proposed),h('pre',null,suggestion??draft))),
              h('div',{className:'am-actions'},button(busy?t.saving:(tab==='diff'?t.save:t.diff),save,'primary',busy||draft===file?.content||suggestion!==null),button(t.templates,()=>setPanel(panel==='template'?'':'template')),button(t.ai,()=>setPanel(panel==='ai'?'':'ai'),'',!models.length)),
              panel==='template'&&h('div',{className:'am-panel'},h('strong',null,t.templates),h('select',{value:applyTemplate,onChange:e=>setApplyTemplate(e.target.value)},h('option',{value:''},t.templates),templates.map(x=>h('option',{key:x.id,value:x.content},x.name))),h('div',{className:'am-actions'},button(t.replace,()=>{setDraft(applyTemplate);setPanel('');setTab('diff')},'',!applyTemplate),button(t.insert,()=>{const pos=editor.current?.selectionStart??draft.length;setDraft(draft.slice(0,pos)+applyTemplate+draft.slice(pos));setPanel('');setTab('diff')},'',!applyTemplate))),
              panel==='ai'&&h('div',{className:'am-panel'},h('strong',null,t.ai),h('div',{className:'am-muted'},t.sent),h('label',null,t.model,h('select',{value:model,onChange:e=>setModel(e.target.value)},models.map(m=>h('option',{key:m.provider+'::'+m.model,value:m.provider+'::'+m.model},m.name+' · '+m.provider)))),h('textarea',{className:'am-text',style:{minHeight:90},placeholder:t.prompt,value:prompt,onChange:e=>setPrompt(e.target.value)}),h('div',{className:'am-actions'},button(t.generate,generate,'primary',busy||!prompt.trim()),busy&&requestController.current&&button(t.cancel,()=>requestController.current.abort()))),
              suggestion!==null&&h('div',{className:'am-panel'},h('strong',null,t.diff),h('div',{className:'am-actions'},button(t.accept,()=>{setDraft(suggestion);setSuggestion(null);setPanel('');setTab('diff')},'primary'),button(t.discard,()=>{setSuggestion(null);setTab('edit')})))):
            selected?h('div',null,h('div',{className:'am-titlebar'},h('div',null,h('h2',null,globalPicked?t.global:picked?.title),h('div',{className:'am-path'},picked?.path||'')),h('div',{className:'am-actions'},button(t.batchPreview,previewAll,'',busy||!fileRows?.length),!globalPicked&&button(t.newRoot,()=>open({scope:'workspace',workspaceId:selected,relativePath:'AGENTS.md'})))),fileRows?.length?h('div',{className:'am-files'},fileRows.map(f=>h('button',{className:'am-file am-row',key:f.relativePath,onClick:()=>open(f.target)},h('div',null,h('strong',null,f.relativePath),f.exists===false&&h('div',{className:'am-path'},t.missing)),h('span',null,'›')))):h('div',{className:'am-empty'},t.noFiles),batch?.selected===selected&&h('div',null,batch.files.map((f,i)=>h('section',{className:'am-panel',key:i},h('strong',null,f.label),h('div',{className:'am-preview'},md(f.content)))))):
            h('div',{className:'am-empty'},query&&results?results.length?results.map(r=>h('button',{className:'am-row',key:(r.workspaceId||'global')+r.relativePath,onClick:()=>open(r.target)},r.title+' / '+r.relativePath)):t.empty:templates.length?t.choose:t.chooseTemplate),
            selected&&query&&results?.length>0&&h('div',{className:'am-panel'},h('strong',null,`${results.length} results`),results.map(r=>h('button',{className:'am-row',key:(r.workspaceId||'global')+r.relativePath,onClick:()=>open(r.target)},r.title+' / '+r.relativePath)))
          )
        )
      );
    }
    return { inject:['slots'], apply(ctx){ ctx.slots.inject('main',()=>ctx.slots.register({name:'main',key:'dsh-agentsmd-manager'},Page));ctx.slots.inject('sidebar.panellist',()=>ctx.slots.register({name:'sidebar.panellist',id:'dsh-agentsmd-manager',order:31,label:'AGENTS.md'},Icon)); } };
  }
});

/* LearningHub milestone bridge — LogicLab */
(function(){
  'use strict';
  const SUPABASE_URL='https://eqplsewompiudxibowrz.supabase.co';
  const SUPABASE_KEY='sb_publishable_fXOaWHOBJ0ByF8L2LF389Q_4gHjstsp';
  const path=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const pageMilestones={
    'converter.html':'number-systems','gates.html':'logic-gates','truth-tables.html':'truth-tables',
    'arithmetic.html':'binary-arithmetic','complements.html':'complements',
    'half-adder.html':'combinational-logic','full-adder.html':'combinational-logic',
    'multiplexer.html':'combinational-logic','encoder.html':'combinational-logic','decoder.html':'combinational-logic',
    'demultiplexer.html':'combinational-logic','flipflops.html':'sequential-logic'
  };
  const milestone=pageMilestones[path];
  if(!milestone && path!=='quiz.html') return;

  function load(){
    if(window.__learningHubBridgeLoaded) return window.__learningHubBridge;
    const p=import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm').then(({createClient})=>{
      const client=createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
      const api={client,mark:async(key)=>{
        const {data:{user}}=await client.auth.getUser();
        if(!user) return false;
        const {data:m,error:me}=await client.from('learning_milestones').select('id').eq('project_key','logiclab').eq('milestone_key',key).maybeSingle();
        if(me||!m) return false;
        const {error}=await client.from('user_milestones').upsert({user_id:user.id,milestone_id:m.id},{onConflict:'user_id,milestone_id',ignoreDuplicates:true});
        return !error;
      }};
      window.__learningHubBridge=api; return api;
    });
    window.__learningHubBridgeLoaded=p; return p;
  }

  function mark(){load().then(api=>api.mark(milestone));}
  function meaningfulInteraction(){
    const selectors='input,select,textarea,button,[role="button"]';
    let timer;
    document.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(mark,700)},{once:true});
    document.addEventListener('change',mark,{once:true});
    document.addEventListener('click',(e)=>{if(e.target.closest(selectors)) mark()},{once:true});
  }
  if(milestone){
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',meaningfulInteraction); else meaningfulInteraction();
  }

  if(path==='quiz.html'){
    const observer=new MutationObserver(()=>{
      const text=(document.body.innerText||'').toLowerCase();
      if(/quiz complete|quiz completed|final score|your score|score:/i.test(text)){
        load().then(api=>api.mark('quiz'));
        observer.disconnect();
      }
    });
    observer.observe(document.body,{childList:true,subtree:true,characterData:true});
  }
})();

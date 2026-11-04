(function(){
  const config=window.YLZ_SUPABASE_CONFIG||{};
  const library=window.supabase;
  const enabled=Boolean(config.enabled&&config.url&&config.publishableKey&&library?.createClient);
  if(!enabled){window.YLZCloudStore={enabled:false};return}

  const client=library.createClient(config.url,config.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  const table=config.table||'projects';
  const bucket=config.bucket||'project-images';
  const completionTagPrefix='__completion_date:';
  const toProject=row=>{
    const rawTags=Array.isArray(row.tags)?row.tags:[];
    const completionTag=rawTags.find(tag=>typeof tag==='string'&&tag.startsWith(completionTagPrefix));
    return {
    id:row.id,
    name:row.name,
    description:row.description,
    introduction:row.introduction,
    completionDate:completionTag?completionTag.slice(completionTagPrefix.length):undefined,
    url:row.url,
    tags:rawTags.filter(tag=>!(typeof tag==='string'&&tag.startsWith(completionTagPrefix))),
    cover:row.cover,
    coverName:row.cover_name||'',
    images:Array.isArray(row.images)?row.images:[],
    imageNames:Array.isArray(row.image_names)?row.image_names:[]
  }};
  const toRow=(project,index)=>{
    const visibleTags=(project.tags||[]).filter(tag=>!(typeof tag==='string'&&tag.startsWith(completionTagPrefix)));
    const storedTags=project.completionDate?[...visibleTags,`${completionTagPrefix}${project.completionDate}`]:visibleTags;
    return {
    id:project.id,
    name:project.name,
    description:project.description,
    introduction:project.introduction||project.description||'',
    url:project.url,
    tags:storedTags,
    cover:project.cover||'',
    cover_name:project.coverName||'',
    images:project.images||[],
    image_names:project.imageNames||[],
    sort_order:index,
    updated_at:new Date().toISOString()
  }};
  async function currentSession(){const {data,error}=await client.auth.getSession();if(error)throw error;return data.session}
  async function ensureAdminSession(){
    const current=await currentSession();
    if(current)return current;
    const email=window.prompt('请输入 Supabase 管理员邮箱');
    if(!email)return null;
    const password=window.prompt('请输入 Supabase 管理员密码');
    if(!password)return null;
    const {data,error}=await client.auth.signInWithPassword({email,password});
    if(error){window.alert(`登录失败：${error.message}`);return null}
    return data.session;
  }
  async function loadProjects(){
    const {data,error}=await client.from(table).select('*').order('sort_order',{ascending:true});
    if(error)throw error;
    return (data||[]).map(toProject);
  }
  async function saveProjects(projects){
    if(!await currentSession())return false;
    const rows=projects.map(toRow);
    const {error}=await client.from(table).upsert(rows,{onConflict:'id'});
    if(error)throw error;
    const {data:existing,error:listError}=await client.from(table).select('id');
    if(listError)throw listError;
    const ids=new Set(projects.map(project=>project.id));
    const stale=(existing||[]).map(row=>row.id).filter(id=>!ids.has(id));
    if(stale.length){const {error:deleteError}=await client.from(table).delete().in('id',stale);if(deleteError)throw deleteError}
    return true;
  }
  async function uploadImage(file,projectId,slot){
    if(!await currentSession())throw new Error('管理员尚未登录');
    const extension=(file.name.split('.').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'')||'jpg';
    const path=`${projectId}/${Date.now()}-${slot}.${extension}`;
    const {error}=await client.storage.from(bucket).upload(path,file,{cacheControl:'3600',upsert:false});
    if(error)throw error;
    const {data}=client.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }
  window.YLZCloudStore={enabled:true,client,ensureAdminSession,loadProjects,saveProjects,uploadImage};
})();

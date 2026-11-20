import {ILLUSTRATED_ICON_BINDINGS as bindings} from './illustrated-icon-bindings.mjs';
const iconPrefix='modules/cyberpunk-equipment-library/assets/icons/';
const detailed=iconPrefix+'pictograms-detailed/';
const unique=new Map();
for(const [key,img]of Object.entries(bindings)){
  const id=key.split(':').slice(0,2).join(':');
  if(!unique.has(id))unique.set(id,img);
  else if(unique.get(id)!==img)unique.set(id,null);
}
/** Apply catalog artwork to rebuilt sources while preserving every non-image value. */
export function applyIllustratedIcons(source,pack,parent=''){
  if(!source||typeof source!=='object')return source;
  const img=bindings[pack+':'+source._id+':'+parent]??unique.get(pack+':'+source._id);
  if(img)source.img=img;
  const ownerImg=source.img;
  function visit(value){
    if(!value||typeof value!=='object')return;
    for(const [field,entry]of Object.entries(value)){
      if(field==='subitems')continue;
      const ownImageField=field==='effectImg'||(field==='value'&&['TokenIcon','TokenEffectIcon'].includes(value.key));
      if(typeof entry==='string'&&entry.startsWith(iconPrefix)&&ownerImg?.startsWith(detailed)
        &&(ownImageField||(field==='img'&&!entry.startsWith(detailed))))value[field]=ownerImg;
      else if(entry&&typeof entry==='object')visit(entry);
    }
  }
  visit(source);
  for(const child of source.system?.subitems??[])applyIllustratedIcons(child,pack,source._id);
  return source;
}

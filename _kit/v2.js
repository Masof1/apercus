/* Kit v2 des maquettes : réservation (table, devis, séjour), avis Google qui défilent, barre d'action mobile.
   Démo publique : aucune donnée saisie n'est envoyée ni gardée (pas de réseau, pas de stockage). */
(function(){
'use strict';
var G='<svg class="k-g" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>';
var ET='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"/></svg>';
var FL='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg>';
var reduit=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function fin(s){return s.replace(/ ([!?:;»])/g,'&nbsp;$1').replace(/« /g,'«&nbsp;')}
function etoiles(n){var h='';for(var i=1;i<=5;i++)h+=i<=n?ET:ET.replace('<svg','<svg class="vide"');return '<span class="k-et" aria-label="'+n+' étoiles sur 5">'+h+'</span>'}

/* ---------- Avis ---------- */
function avis(el,c){
 var carte=function(a,dup){return '<article class="k-avis"'+(dup?' aria-hidden="true"':'')+'><header><img src="'+a.img+'" alt="" width="42" height="42" decoding="async"><div><strong>'+esc(a.n)+'</strong><span>'+esc(a.d)+'</span></div>'+G+'</header>'+etoiles(a.s)+'<p>'+esc(a.t)+'</p></article>'};
 var cartes=c.avis.map(function(a){return carte(a)}).join('');
 var defile=c.avis.length>=4;
 var tete='<div class="k-avis-tete"><a class="k-badge" href="'+c.fiche+'" target="_blank" rel="noopener">'+G+(c.note?'<b>'+c.note+'</b>':'')+'<span class="k-badge-txt"><strong>Avis Google</strong>'+(c.note?etoiles(Math.round(parseFloat(c.note.replace(',','.')))):'')+'<span>'+c.nombre+' avis sur la fiche</span></span></a><a class="k-voir" href="'+c.fiche+'" target="_blank" rel="noopener">Voir tous les avis sur Google'+FL+'</a></div>';
 el.innerHTML=tete+'<div class="k-rail'+(defile?'':' k-avis-fixe')+(c.avis.length===1?' k-avis-une':'')+'" tabindex="0" aria-label="Avis Google"><div class="k-piste">'+cartes+(defile?c.avis.map(function(a){return carte(a,1)}).join(''):'')+'</div></div>'+(c.source?'<p class="k-source">'+c.source+'</p>':'');
 if(!defile)return;
 var rail=el.querySelector('.k-rail'),piste=el.querySelector('.k-piste'),pause=0,vu=true,x=0,glisse=null;
 if('IntersectionObserver' in window)new IntersectionObserver(function(e){vu=e[0].isIntersecting}).observe(rail);
 function stop(){pause=Date.now()+2600}
 rail.addEventListener('pointerenter',function(e){if(e.pointerType==='mouse')pause=Infinity});
 rail.addEventListener('pointerleave',function(e){if(e.pointerType==='mouse'){pause=0;glisse=null;rail.classList.remove('tient')}});
 rail.addEventListener('touchstart',stop,{passive:true});rail.addEventListener('wheel',stop,{passive:true});rail.addEventListener('focusin',function(){pause=Infinity});rail.addEventListener('focusout',stop);
 rail.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;glisse={x:e.clientX,s:rail.scrollLeft};rail.classList.add('tient')});
 addEventListener('pointerup',function(){glisse=null;rail.classList.remove('tient')});
 rail.addEventListener('pointermove',function(e){if(glisse){rail.scrollLeft=glisse.s-(e.clientX-glisse.x)}});
 rail.addEventListener('scroll',function(){var m=piste.scrollWidth/2;if(rail.scrollLeft>=m)rail.scrollLeft-=m;x=rail.scrollLeft});
 if(reduit)return;
 var t0=0;(function tic(t){var dt=t0?Math.min(t-t0,50):16;t0=t;if(vu&&Date.now()>pause&&!glisse){x+=dt*0.05;var m=piste.scrollWidth/2;if(x>=m)x-=m;rail.scrollLeft=x}requestAnimationFrame(tic)})(0);
}

/* ---------- Réservation ---------- */
var JC=['dim.','lun.','mar.','mer.','jeu.','ven.','sam.'],JL=['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'],MA=['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'],MO=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
function jour0(d){return new Date(d.getFullYear(),d.getMonth(),d.getDate())}
function cle(d){return d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate()}
function txtDate(d){return JL[d.getDay()]+' '+d.getDate()+' '+MO[d.getMonth()]}
function court(d){return JC[d.getDay()]+' '+d.getDate()+' '+MA[d.getMonth()]}
function nuits(a,b){return Math.round((jour0(b)-jour0(a))/864e5)}
function euros(n){return n.toLocaleString('fr-BE').replace(/ | /g,' ')+' €'}

function resa(el,c){
 c.nuitsMin=c.nuitsMin||1;c.max=c.max||12;c.aideCal=c.aideCal||'';c.aideJours=c.aideJours||'';c.resumeTitre=c.resumeTitre||'Votre demande';c.envoyer=c.envoyer||'Envoyer';
 var auj=jour0(new Date()),S={e:0,date:null,heure:null,n:c.defaut||2,presta:null,moment:null,a:null,b:null,mois:0,f:{}},anim=true;
 var titres=[c.titreEtape||(c.type==='sejour'?'Vos dates':c.type==='devis'?'Votre projet':c.type==='rdv'?'Votre rendez-vous':'Votre table'),'Vos coordonnées','Confirmation'];
 function nomP(p){return typeof p==='string'?p:p.nom}
 function slots(){if(!S.date)return c.creneaux||[];var cj=c.creneauxJour&&c.creneauxJour[S.date.getDay()];return cj||c.creneaux||[]}
 function jours(nb,ouverts){var r=[];for(var i=0;r.length<nb&&i<60;i++){var d=new Date(auj);d.setDate(d.getDate()+i+(c.decalage||0));r.push({d:d,ok:ouverts.indexOf(d.getDay())>-1})}return r}
 function formule(){if(!S.a||!S.b||!(c.formules&&c.formules.length))return null;var n=nuits(S.a,S.b);for(var i=0;i<c.formules.length;i++)if(c.formules[i].nuits===n)return c.formules[i];return {nom:n+' nuits',sur:true}}
 function valide(){if(S.e===0){if(c.type==='table')return S.date&&S.heure;if(c.type==='devis')return S.presta&&S.date&&S.moment;if(c.type==='rdv')return S.presta&&S.date&&S.heure;return S.a&&S.b}
  return (S.f.nom||'').trim().length>1&&(S.f.tel||'').replace(/\D/g,'').length>=9}
 function lignes(){var L=[];
  if(c.type==='table')L=[['Date',S.date&&txtDate(S.date)],['Heure',S.heure&&S.heure.replace(':',' h ')],[c.libN||'Couverts',S.n+' '+(S.n>1?'personnes':'personne')]];
  if(c.type==='devis')L=[[c.libPresta||'Travaux',S.presta],['Visite',S.date&&txtDate(S.date)],['Moment',S.moment]];
  if(c.type==='rdv'){var pr=(c.prestations||[]).filter(function(p){return nomP(p)===S.presta})[0];L=[[c.libPresta||'Prestation',S.presta],['Jour',S.date&&txtDate(S.date)],['Heure',S.heure&&S.heure.replace(':',' h ')]];if(pr&&pr.prix)L.push(['Prix',pr.prix])}
  if(c.type==='sejour'){var f=formule();L=[['Arrivée',S.a&&court(S.a)],['Départ',S.b&&court(S.b)],['Nuits',S.a&&S.b&&String(nuits(S.a,S.b))],['Voyageurs',S.n+' '+(S.n>1?'personnes':'personne')]]}
  if(S.e>0&&S.f.nom)L.push(['Au nom de',S.f.nom.trim()]);return L}
 function resume(){var h='<h3>'+c.resumeTitre+'</h3><dl>'+lignes().map(function(l){return '<div><dt>'+l[0]+'</dt><dd class="'+(l[1]?'':'vide')+'">'+(l[1]?esc(l[1]):'à choisir')+'</dd></div>'}).join('')+'</dl>';
  if(c.type==='sejour'){var fs=c.formules&&c.formules.length,f=formule();h+='<div class="k-prix">'+(!fs?(c.prixTexte||'Prix sur demande'):f?(f.sur?'Sur demande':euros(f.min)+' – '+euros(f.max)):'De '+euros(c.formules[0].min)+' à '+euros(c.formules[c.formules.length-1].max))+'<small>'+(!fs?(c.prixAide||'Le prix exact vous est donné avec la réponse. '):f&&!f.sur?'Tarif '+f.nom.toLowerCase()+' pour toute la maison, selon la saison. ':'Prix pour toute la maison, selon la durée et la saison. ')+(c.frais||'')+'</small></div>'}
  return h+'<p>Module de démonstration : rien de ce que vous saisissez n\'est envoyé ni enregistré.</p>'}
 function etapes(){return '<ol class="k-etapes">'+titres.map(function(t,i){return '<li class="'+(i<S.e?'fait':i===S.e?'en-cours':'')+'">'+t+'</li>'}).join('')+'</ol>'}
 function pas(){return '<div class="k-pas"><button type="button" data-pas="-1" aria-label="Moins"'+(S.n<=1?' disabled':'')+'>−</button><output>'+S.n+' '+(S.n>1?'personnes':'personne')+'</output><button type="button" data-pas="1" aria-label="Plus"'+(S.n>=c.max?' disabled':'')+'>+</button></div>'+(c.aideMax?'<p class="k-aide">'+c.aideMax+'</p>':'')}
 function bandeJours(liste,ferme){return '<div class="k-defile">'+liste.map(function(j){var on=S.date&&cle(S.date)===cle(j.d);return '<button type="button" class="k-jour" data-jour="'+cle(j.d)+'" aria-pressed="'+!!on+'"'+(j.ok?'':' disabled')+'><small>'+JC[j.d.getDay()].replace('.','')+'</small><b>'+j.d.getDate()+'</b><i>'+(j.ok?MA[j.d.getMonth()]:ferme)+'</i></button>'}).join('')+'</div>'}
 function mois(dec){var m=new Date(auj.getFullYear(),auj.getMonth()+dec,1),prem=(m.getDay()+6)%7,nb=new Date(m.getFullYear(),m.getMonth()+1,0).getDate(),h='<div class="k-mois"><h4>'+MO[m.getMonth()]+' '+m.getFullYear()+'</h4><table><thead><tr>'+['lu','ma','me','je','ve','sa','di'].map(function(x){return '<th>'+x+'</th>'}).join('')+'</tr></thead><tbody><tr>',col=0;
  for(var i=0;i<prem;i++){h+='<td></td>';col++}
  for(var j=1;j<=nb;j++){var d=new Date(m.getFullYear(),m.getMonth(),j),k='',passe=d<auj;
   if(S.a&&cle(d)===cle(S.a)||S.b&&cle(d)===cle(S.b))k='bout';else if(S.a&&S.b&&d>S.a&&d<S.b)k='dans';
   h+='<td class="'+k+'"><button type="button" data-cal="'+cle(d)+'"'+(passe?' disabled':'')+' aria-label="'+txtDate(d)+'">'+j+'</button></td>';
   if(++col%7===0&&j<nb)h+='</tr><tr>'}
  return h+'</tr></tbody></table></div>'}
 function corps(){
  if(S.e===2){var p=(S.f.nom||'').trim().split(/\s+/)[0];return '<div class="k-merci k-panneau"><svg class="k-coche" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="29"/><path d="M20 33l8 8 16-17"/></svg><h3>'+fin(esc(c.merci.replace('{prenom}',p)))+'</h3><p>'+fin(esc(c.merciTxt))+'</p><div class="k-demo"><span aria-hidden="true">ⓘ</span><span><b>Démo :</b> sur votre vrai site, la demande arrive chez vous par e-mail ou SMS. Ici, rien n\'est envoyé.</span></div><div class="k-actions" style="justify-content:center"><button type="button" class="k-retour" data-re>Faire une autre demande</button></div></div>'}
  if(S.e===1){var ch='<label>Nom et prénom<input name="nom" autocomplete="name" value="'+esc(S.f.nom||'')+'" required></label><label>Téléphone<input name="tel" type="tel" inputmode="tel" autocomplete="tel" value="'+esc(S.f.tel||'')+'" placeholder="04xx xx xx xx" required></label>';
   (c.champs||[]).forEach(function(x){ch+='<label class="'+(x.plein?'plein':'')+'">'+x.lab+(x.zone?'<textarea name="'+x.nom+'" placeholder="'+(x.ph||'')+'">'+esc(S.f[x.nom]||'')+'</textarea>':'<input name="'+x.nom+'" type="'+(x.type||'text')+'" autocomplete="'+(x.ac||'off')+'" value="'+esc(S.f[x.nom]||'')+'" placeholder="'+(x.ph||'')+'">')+'</label>'});
   return '<div class="'+(anim?'k-panneau':'')+'"><div class="k-champs">'+ch+'</div><div class="k-actions"><button type="button" class="k-retour" data-ret>Retour</button><button type="button" class="k-bouton" data-suiv'+(valide()?'':' disabled')+'>'+c.envoyer+'</button></div></div>'}
  var h='';
  if(c.type==='table'){var js=jours(14,c.ouverts);h+='<p class="k-lab">Quel jour ?<small>'+c.aideJours+'</small></p>'+bandeJours(js,'fermé');
   h+='<p class="k-lab">À quelle heure ?</p><div class="k-grille">'+slots().map(function(t){var off=false;if(S.date&&cle(S.date)===cle(auj)){var n=new Date(),hm=t.split(':');off=(+hm[0]*60+ +hm[1])<=n.getHours()*60+n.getMinutes()+30}return '<button type="button" class="k-puce" data-heure="'+t+'" aria-pressed="'+(S.heure===t)+'"'+(off?' disabled':'')+'>'+t.replace(':',' h ')+'</button>'}).join('')+'</div>';
   h+='<p class="k-lab">Combien de personnes ?</p>'+pas()}
  if(c.type==='rdv'){h+='<p class="k-lab">'+(c.questionPresta||'Quelle prestation ?')+'</p><div class="k-grille large">'+c.prestations.map(function(p){var n=nomP(p);return '<button type="button" class="k-puce" data-presta="'+esc(n)+'" aria-pressed="'+(S.presta===n)+'"><span style="flex:1">'+esc(n)+(p.duree?'<small style="display:block;font-size:12.5px;opacity:.75;font-weight:400">'+esc(p.duree)+'</small>':'')+'</span>'+(p.prix?'<b style="font-weight:600">'+esc(p.prix)+'</b>':'')+'</button>'}).join('')+'</div>';
   h+='<p class="k-lab">Quel jour ?<small>'+(c.aideJours||'')+'</small></p>'+bandeJours(jours(14,c.ouverts),'fermé');
   h+='<p class="k-lab">À quelle heure ?</p><div class="k-grille">'+slots().map(function(t){var off=false;if(S.date&&cle(S.date)===cle(auj)){var n=new Date(),hm=t.split(':');off=(+hm[0]*60+ +hm[1])<=n.getHours()*60+n.getMinutes()+30}return '<button type="button" class="k-puce" data-heure="'+t+'" aria-pressed="'+(S.heure===t)+'"'+(off?' disabled':'')+'>'+t.replace(':',' h ')+'</button>'}).join('')+'</div>'}
  if(c.type==='devis'){h+='<p class="k-lab">'+(c.questionPresta||'Quels travaux ?')+'</p><div class="k-grille large">'+c.prestations.map(function(p){return '<button type="button" class="k-puce" data-presta="'+esc(p)+'" aria-pressed="'+(S.presta===p)+'">'+esc(p)+'</button>'}).join('')+'</div>';
   h+='<p class="k-lab">Quand passer chez vous ?<small>'+c.aideJours+'</small></p>'+bandeJours(jours(12,c.ouverts),'—');
   h+='<div class="k-grille moments" style="margin-top:10px">'+c.moments.map(function(m){return '<button type="button" class="k-puce" data-moment="'+m+'" aria-pressed="'+(S.moment===m)+'">'+m+'</button>'}).join('')+'</div>'}
  if(c.type==='sejour'){h+='<div class="k-cal-tete"><button type="button" data-mois="-1" aria-label="Mois précédent"'+(S.mois<=0?' disabled':'')+'>‹</button><span class="k-lab" style="margin:0">'+(!S.a?'Choisissez votre arrivée':!S.b?'Choisissez votre départ':nuits(S.a,S.b)+' nuits sélectionnées')+'</span><button type="button" data-mois="1" aria-label="Mois suivant"'+(S.mois>=10?' disabled':'')+'>›</button></div><div class="k-mois-duo">'+mois(S.mois)+mois(S.mois+1)+'</div>';
   h+='<div class="k-legende"><span><i></i>Arrivée et départ</span><span>'+c.aideCal+'</span></div>'+(S.msg?'<p class="k-aide" role="status">'+S.msg+'</p>':'');
   h+='<p class="k-lab">Combien serez-vous ?</p>'+pas()}
  return '<div class="'+(anim?'k-panneau':'')+'">'+h+'<div class="k-actions"><span></span><button type="button" class="k-bouton" data-suiv'+(valide()?'':' disabled')+'>Continuer<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></div></div>'}
 function rendu(){el.innerHTML='<div class="k-corps">'+etapes()+corps()+'</div><aside class="k-resume" aria-live="polite">'+resume()+'</aside>';anim=false}
 function trouve(k){var p=k.split('-');return new Date(+p[0],+p[1],+p[2])}
 el.addEventListener('click',function(ev){var b=ev.target.closest('button');if(!b||b.disabled)return;var d=b.dataset;
  if(d.jour){S.date=trouve(d.jour);if(S.heure&&(cle(S.date)===cle(auj)||slots().indexOf(S.heure)<0))S.heure=null}
  else if(d.heure)S.heure=d.heure;else if(d.presta)S.presta=d.presta;else if(d.moment)S.moment=d.moment;
  else if(d.pas)S.n=Math.max(1,Math.min(c.max,S.n+ +d.pas));
  else if(d.mois)S.mois=Math.max(0,S.mois+ +d.mois);
  else if(d.cal){var x=trouve(d.cal);S.msg='';if(!S.a||S.b||x<=S.a){S.a=x;S.b=null}else if(nuits(S.a,x)<c.nuitsMin){S.msg=c.nuitsMin+' nuits minimum : choisissez un départ plus tard.'}else S.b=x}
  else if('suiv' in d){S.e++;anim=true;rendu();var f=el.querySelector('input');if(f&&S.e===1)f.focus({preventScroll:true});el.scrollIntoView({block:'nearest',behavior:reduit?'auto':'smooth'});return}
  else if('ret' in d){S.e--;anim=true}
  else if('re' in d){S={e:0,date:null,heure:null,n:c.defaut||2,presta:null,moment:null,a:null,b:null,mois:0,f:{}};anim=true}
  else return;
  var sl=el.querySelector('.k-defile'),sx=sl&&sl.scrollLeft;rendu();var sl2=el.querySelector('.k-defile');if(sl2&&sx)sl2.scrollLeft=sx});
 el.addEventListener('input',function(ev){var t=ev.target;if(!t.name)return;S.f[t.name]=t.value;var b=el.querySelector('[data-suiv]');if(b)b.disabled=!valide();el.querySelector('.k-resume').innerHTML=resume()});
 rendu();
}

/* ---------- Barre mobile ---------- */
function barre(){var b=document.querySelector('.k-barre');if(!b)return;var cible=document.querySelector(b.dataset.cache||'#reserver');
 var f=function(){var r=cible&&cible.getBoundingClientRect(),dedans=r&&r.top<innerHeight&&r.bottom>0;b.classList.toggle('vis',scrollY>innerHeight*.7&&!dedans)};addEventListener('scroll',f,{passive:true});addEventListener('resize',f);f()}

/* ---------- Héros : légère profondeur au pointeur ---------- */
function profondeur(){if(reduit||!matchMedia('(pointer:fine)').matches)return;document.querySelectorAll('[data-profond]').forEach(function(z){var cs=z.querySelectorAll('[data-p]');z.addEventListener('pointermove',function(e){var r=z.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;cs.forEach(function(c){var k=+c.dataset.p;c.style.translate=(x*k).toFixed(1)+'px '+(y*k).toFixed(1)+'px'})});z.addEventListener('pointerleave',function(){cs.forEach(function(c){c.style.translate=''})})})}

/* ---------- Retour discret vers le studio (dans le bandeau « Maquette proposée ») ---------- */
function retour(){var m=document.querySelector('.maquette');if(!m||m.querySelector('.k-retour'))return;
 var g=location.pathname.match(/\/([a-z0-9-]+)\/(?:index\.html)?$/),a=document.createElement('a');
 a.className='k-retour';a.href='https://mfgraphic.be/'+(g?'?m='+g[1]:'');a.textContent='mfgraphic.be';a.title='Retour au site du studio MFgraphic';
 a.setAttribute('style','color:inherit;text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1px;opacity:.85;white-space:nowrap;display:inline-block;padding:4px 2px;margin:-4px 0');
 m.appendChild(document.createTextNode(' · '));m.appendChild(a)}

window.KIT={avis:avis,resa:resa};
function go(){var a=document.getElementById('k-avis');if(a&&window.KIT_AVIS)avis(a,window.KIT_AVIS);var r=document.getElementById('k-resa');if(r&&window.KIT_RESA)resa(r,window.KIT_RESA);barre();profondeur();retour()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();
})();

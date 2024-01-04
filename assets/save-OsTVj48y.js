function l(e,o){const s=JSON.parse(localStorage.getItem("lists")).map(t=>t.title===o.listTitle?{...t,tasks:e}:t);localStorage.setItem("lists",JSON.stringify(s))}export{l as s};

const state={balance:24580,transactions:[
{name:"Amazon",category:"Shopping",amount:-1299,type:"expense",icon:"🛒",date:"Today"},
{name:"Swiggy",category:"Food",amount:-420,type:"expense",icon:"🍔",date:"Yesterday"},
{name:"Salary",category:"Income",amount:25000,type:"income",icon:"💰",date:"Sep 30"},
{name:"Netflix",category:"Entertainment",amount:-649,type:"expense",icon:"N",date:"Sep 29"},
{name:"Rahul",category:"Transfer",amount:-500,type:"expense",icon:"R",date:"Sep 28"},
{name:"Wallet Top-up",category:"Added",amount:2000,type:"income",icon:"＋",date:"Sep 27"}]};

const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);
const money=n=>"₹"+Math.abs(n).toLocaleString("en-IN");
function showToast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove("show"),2500)}
function renderBalance(){["#mainBalance","#availableBalance","#walletBalance"].forEach(id=>{const el=$(id);if(el)el.textContent=money(state.balance)})}
function transactionHTML(t){return `<div class="transaction"><div class="tx-icon">${t.icon}</div><div class="tx-main"><strong>${t.name}</strong><small>${t.category} · ${t.date}</small></div><div class="tx-amount ${t.amount>=0?"positive":"negative"}">${t.amount>=0?"+":"-"}${money(t.amount)}</div></div>`}
function renderTransactions(list=state.transactions){$("#recentTransactions").innerHTML=list.slice(0,5).map(transactionHTML).join("");$("#allTransactions").innerHTML=list.map(transactionHTML).join("")}
function openPage(id){
  $$(".page").forEach(p=>p.classList.toggle("active",p.id===id));
  $$(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.page===id));
  const names={dashboard:"Good evening, Bindu 👋",wallet:"My Wallet",transactions:"Transactions",analytics:"Analytics",goals:"Savings Goals",subscriptions:"Subscriptions",settings:"Settings"};
  $("#pageTitle").textContent=names[id]||"NOVA";
  window.scrollTo({top:0,behavior:"smooth"});
}
$$(".nav-item").forEach(b=>b.addEventListener("click",()=>openPage(b.dataset.page)));
$$("[data-page-link]").forEach(b=>b.addEventListener("click",()=>openPage(b.dataset.pageLink)));

function openModal(content){$("#modalContent").innerHTML=content;$("#modalBackdrop").classList.add("show")}
function closeModal(){$("#modalBackdrop").classList.remove("show")}
$("#closeModal").addEventListener("click",closeModal);
$("#modalBackdrop").addEventListener("click",e=>{if(e.target.id==="modalBackdrop")closeModal()});

$("#addMoneyBtn").addEventListener("click",()=>openModal(`<h2>Add money</h2><p>Simulate adding money to your NOVA balance.</p><form id="moneyForm"><label>Amount<input id="amount" type="number" min="1" placeholder="e.g. 5000" required></label><button class="primary-btn">Add to wallet</button></form>`));
$("#sendMoneyBtn").addEventListener("click",()=>openModal(`<h2>Send money</h2><p>This is a demo transfer. No real money is sent.</p><form id="sendForm"><label>Recipient<input id="recipient" placeholder="e.g. Rahul" required></label><label>Amount<input id="amount" type="number" min="1" placeholder="e.g. 500" required></label><button class="primary-btn">Send money</button></form>`));

$("#modalContent").addEventListener("submit",e=>{
  e.preventDefault();
  const amount=Number($("#amount").value);
  if(e.target.id==="moneyForm"){
    state.balance+=amount;
    state.transactions.unshift({name:"Wallet Top-up",category:"Added",amount,type:"income",icon:"＋",date:"Just now"});
    showToast(`₹${amount.toLocaleString("en-IN")} added to your wallet`);
  }else{
    const recipient=$("#recipient").value;
    if(amount>state.balance){showToast("Insufficient demo balance");return}
    state.balance-=amount;
    state.transactions.unshift({name:recipient,category:"Transfer",amount:-amount,type:"expense",icon:recipient[0].toUpperCase(),date:"Just now"});
    showToast(`₹${amount.toLocaleString("en-IN")} sent to ${recipient}`);
  }
  renderBalance();renderTransactions();closeModal();
});

$("#flipCardBtn").addEventListener("click",()=>$("#virtualCard").classList.toggle("flipped"));
$("#virtualCard").addEventListener("click",()=>$("#virtualCard").classList.toggle("flipped"));

function goalModal(){openModal(`<h2>Create a goal</h2><p>Give your next goal a name and target amount.</p><form id="goalForm"><label>Goal name<input id="goalName" placeholder="e.g. New Laptop" required></label><label>Target amount<input id="goalAmount" type="number" min="1" placeholder="e.g. 60000" required></label><button class="primary-btn">Create goal</button></form>`)}
$("#createGoalBtn").addEventListener("click",goalModal);
$("#addGoalCard").addEventListener("click",goalModal);
$("#modalContent").addEventListener("submit",e=>{if(e.target.id==="goalForm"){showToast(`Goal "${$("#goalName").value}" created for ₹${Number($("#goalAmount").value).toLocaleString("en-IN")}`);closeModal()}});

$("#searchInput").addEventListener("input",filterTransactions);
$("#typeFilter").addEventListener("change",filterTransactions);
function filterTransactions(){const q=$("#searchInput").value.toLowerCase();const type=$("#typeFilter").value;renderTransactions(state.transactions.filter(t=>(t.name+" "+t.category).toLowerCase().includes(q)&&(type==="all"||t.type===type)))}

function setTheme(dark){document.body.classList.toggle("dark",dark);$("#darkSwitch").checked=dark;localStorage.setItem("nova-dark",dark?"1":"0")}
$("#themeBtn").addEventListener("click",()=>setTheme(!document.body.classList.contains("dark")));
$("#darkSwitch").addEventListener("change",e=>setTheme(e.target.checked));
if(localStorage.getItem("nova-dark")==="1")setTheme(true);
$("#notifyBtn").addEventListener("click",()=>showToast("You have no new notifications ✦"));

renderBalance();renderTransactions();

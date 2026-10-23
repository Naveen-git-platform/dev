"use client";

import { useEffect, useMemo, useState } from "react";
import { MapPin, ChevronDown, HeartPulse, Hospital, Building2, Baby, ShieldPlus, Cross, Star } from "lucide-react";
import type { Facility } from "./page";

export const CONSTITUENCIES = [
  {name:"Amberpet", district:"Hyderabad", areas:["Amberpet","Bagh Amberpet","Tilak Nagar"], summary:"Central-east residential catchment. Verify facility locations against official constituency boundaries."},
  {name:"Bahadurpura", district:"Hyderabad", areas:["Bahadurpura","Shamshabad Road","Falaknuma"], summary:"South Hyderabad catchment with public and private healthcare providers."},
  {name:"Chandrayangutta", district:"Hyderabad", areas:["Chandrayangutta","Bandlaguda","Kandikal"], summary:"Southern urban catchment; explore mapped facilities and available services."},
  {name:"Charminar", district:"Hyderabad", areas:["Charminar","Pathergatti","Moghalpura"], summary:"Historic central catchment with hospitals, clinics and pharmacies."},
  {name:"Goshamahal", district:"Hyderabad", areas:["Goshamahal","Mangalhat","Begum Bazar"], summary:"Central-west catchment; listings depend on available community map data."},
  {name:"Jubilee Hills", district:"Hyderabad", areas:["Jubilee Hills","Banjara Hills","Film Nagar"], summary:"West-central catchment with multispecialty and specialty-care providers."},
  {name:"Karwan", district:"Hyderabad", areas:["Karwan","Tolichowki","Gudimalkapur"], summary:"South-west catchment for comparing mapped care options."},
  {name:"Khairatabad", district:"Hyderabad", areas:["Khairatabad","Somajiguda","Panjagutta","Ameerpet"], summary:"Central catchment with a broad mix of hospitals and outpatient services."},
  {name:"Kukatpally", district:"Medchal–Malkajgiri", areas:["Kukatpally","KPHB","Moosapet","Balanagar"], summary:"North-west urban catchment with hospitals, clinics and diagnostic services."},
  {name:"LB Nagar", district:"Rangareddy", areas:["LB Nagar","Vanasthalipuram","Kothapet"], summary:"Eastern urban catchment with public and private providers."},
  {name:"Malakpet", district:"Hyderabad", areas:["Malakpet","Dilsukhnagar","Chanchalguda"], summary:"Central-south catchment for local healthcare discovery."},
  {name:"Malkajgiri", district:"Medchal–Malkajgiri", areas:["Malkajgiri","Anandbagh","Neredmet"], summary:"North-east catchment with neighborhood healthcare services."},
  {name:"Medchal", district:"Medchal–Malkajgiri", areas:["Medchal","Kompally","Suchitra"], summary:"Northern catchment spanning urban and peri-urban communities."},
  {name:"Musheerabad", district:"Hyderabad", areas:["Musheerabad","RTC X Roads","Gandhi Nagar"], summary:"North-central catchment with hospitals and outpatient facilities."},
  {name:"Nampally", district:"Hyderabad", areas:["Nampally","Abids","Red Hills"], summary:"Central Hyderabad healthcare catchment."},
  {name:"Quthbullapur", district:"Medchal–Malkajgiri", areas:["Quthbullapur","Jeedimetla","Chintal"], summary:"North-west catchment with hospitals, clinics and diagnostics."},
  {name:"Rajendranagar", district:"Rangareddy", areas:["Rajendranagar","Attapur","Aramghar"], summary:"South-west catchment spanning established neighborhoods and growth corridors."},
  {name:"Sanathnagar", district:"Hyderabad", areas:["Sanathnagar","Erragadda","Fateh Nagar"], summary:"West-central catchment with neighborhood and specialty services."},
  {name:"Secunderabad Cantonment", district:"Medchal–Malkajgiri", areas:["Secunderabad Cantonment","Trimulgherry","Alwal"], summary:"Northern catchment; military and civilian facilities may both be relevant."},
  {name:"Serilingampally", district:"Rangareddy", areas:["Serilingampally","Gachibowli","Kondapur","Madhapur","HITEC City","Miyapur","Nallagandla","Financial District","KPHB"], summary:"West-city cluster with major corporate hospitals, specialty centers and public infrastructure. Verify facility-to-seat assignment against authoritative boundaries."},
  {name:"Uppal", district:"Medchal–Malkajgiri", areas:["Uppal","Nagole","Habsiguda"], summary:"East Hyderabad catchment for local healthcare discovery."},
  {name:"Yakutpura", district:"Hyderabad", areas:["Yakutpura","Saidabad","Noor Khan Bazar"], summary:"South-central catchment with a mix of community and private providers."}
] as const;

const specialFilters = [
  {id:"heart", label:"Heart care", icon:HeartPulse, terms:["cardiac","cardiology","heart","cardio"]},
  {id:"cancer", label:"Cancer care", icon:Cross, terms:["cancer","oncology","tumour","tumor"]},
  {id:"women-child", label:"Women & child", icon:Baby, terms:["maternity","women","child","paediatric","pediatric","gynaec","gynec","obstetric"]},
  {id:"emergency-care", label:"Emergency care", icon:ShieldPlus, terms:["emergency","trauma","ambulance","casualty"]},
  {id:"top", label:"Top hospitals", icon:Star, terms:["apollo","kims","yashoda","continental","aig","care hospitals"]}
];

export function ConstituencyExplorer({facilities, onSelectFacility, selectedName, onFilterIds}:{facilities:Facility[];onSelectFacility:(name:string)=>void;selectedName:string;onFilterIds:(ids:string[]|null)=>void}) {
  const [seat,setSeat] = useState("All constituencies");
  const [owner,setOwner] = useState("All ownership");
  const [special,setSpecial] = useState("");
  const selectedSeat = CONSTITUENCIES.find(c=>c.name===seat);
  const match = (f:Facility) => {
    const hay = `${f.name} ${f.address} ${f.area??""} ${f.ownership??""} ${Object.values(f.tags).join(" ")}`.toLowerCase();
    const seatMatch = !selectedSeat || selectedSeat.areas.some(a=>hay.includes(a.toLowerCase())) || hay.includes(selectedSeat.name.toLowerCase());
    const ownership = (f.ownership??f.tags.operator??f.tags.ownership??"").toLowerCase();
    const ownerMatch = owner==="All ownership" || (owner==="Government" ? /government|public|municipal|state|central|district/.test(ownership) : owner==="Corporate" ? /apollo|kims|yashoda|continental|aig|care hospitals|private|limited|ltd/.test(ownership) : /trust|ngo|charit|military|army|defence|defense/.test(ownership));
    const specialtyMatch = !special || specialFilters.find(s=>s.id===special)?.terms.some(t=>hay.includes(t));
    return seatMatch && ownerMatch && specialtyMatch;
  };
  const matchingFacilities = facilities.filter(match);
  const count = matchingFacilities.length;
  useEffect(() => {
    const isDefault = seat === "All constituencies" && owner === "All ownership" && !special;
    onFilterIds(isDefault ? null : matchingFacilities.map(f => f.id));
  }, [seat, owner, special, facilities, onFilterIds]);
  return <section className="constituency-explorer">
    <div className="explorer-heading"><div><span className="section-kicker">HEALTHCARE INTELLIGENCE</span><h2>Explore by constituency</h2><p>Browse local healthcare clusters and narrow the directory by ownership or specialty.</p></div><div className="seat-count"><Hospital size={17}/><b>{count}</b><span>matching listings</span></div></div>
    <div className="explorer-controls">
      <label className="seat-select"><MapPin size={16}/><select value={seat} onChange={e=>setSeat(e.target.value)} aria-label="Select constituency"><option>All constituencies</option>{CONSTITUENCIES.map(c=><option key={c.name}>{c.name}</option>)}</select><ChevronDown size={15}/></label>
      <label className="seat-select"><Building2 size={16}/><select value={owner} onChange={e=>setOwner(e.target.value)} aria-label="Filter by ownership"><option>All ownership</option><option>Government</option><option>Corporate</option><option>Trust / NGO / Military</option></select><ChevronDown size={15}/></label>
    </div>
    <div className="specialty-chips">{specialFilters.map(s=>{const Icon=s.icon;return <button key={s.id} className={special===s.id?"specialty-chip active":"specialty-chip"} onClick={()=>setSpecial(special===s.id?"":s.id)}><Icon size={14}/>{s.label}</button>})}<button className="specialty-reset" onClick={()=>{setSeat("All constituencies");setOwner("All ownership");setSpecial("");}}>Reset</button></div>
    {selectedSeat&&<div className="seat-summary"><div className="seat-summary-title"><div><span className="section-kicker">AC · {selectedSeat.district.toUpperCase()}</span><h3>{selectedSeat.name}</h3></div><button onClick={()=>setSeat("All constituencies")}>All seats</button></div><p>{selectedSeat.summary}</p><div className="area-tags">{selectedSeat.areas.map(a=><span key={a}>{a}</span>)}</div><small>Neighborhood names are discovery hints, not official boundary geometry. Verify seat membership before relying on these results.</small></div>}
    <div className="seat-facility-preview"><span className="section-kicker">{selectedSeat?selectedSeat.name.toUpperCase():"QUICK CONSTITUENCY ACCESS"}</span><div className="seat-buttons">{CONSTITUENCIES.map(c=><button key={c.name} className={seat===c.name?"seat-button active":"seat-button"} onClick={()=>setSeat(c.name)}>{c.name}</button>)}</div></div>
    <div className="explorer-results"><b>{count} matching facilities</b><span>Search results are based on available OpenStreetMap tags and address text.</span><div>{matchingFacilities.slice(0,8).map(f=><button key={f.id} onClick={()=>onSelectFacility(f.id)} className={selectedName===f.id?"mini-facility active":"mini-facility"}><span>{f.name}</span><small>{f.area??f.address}</small></button>)}</div></div>
  </section>;
}

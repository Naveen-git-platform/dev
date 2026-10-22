"use client";
import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import type { Facility } from "./page";
const colors:Record<string,string>={hospital:"#e45757",clinic:"#3678d4",pharmacy:"#159a78",laboratory:"#9462ce",dentist:"#d28b25",other:"#64748b"};
function FitSelection({facility}:{facility:Facility|null}){const map=useMap();useEffect(()=>{if(facility)map.flyTo([facility.lat,facility.lon],Math.max(map.getZoom(),15),{duration:.65})},[facility,map]);return null}
export default function HealthcareMap({facilities,selected,onSelect}:{facilities:Facility[];selected:Facility|null;onSelect:(f:Facility)=>void}){
 useEffect(()=>{delete (L.Icon.Default.prototype as any)._getIconUrl;L.Icon.Default.mergeOptions({iconRetinaUrl:"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",iconUrl:"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",shadowUrl:"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png"})},[]);
 return <MapContainer center={[17.385,78.4867]} zoom={11} minZoom={9} maxZoom={19} scrollWheelZoom className="leaflet-map"><TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /><FitSelection facility={selected}/>{facilities.map(f=><CircleMarker key={f.id} center={[f.lat,f.lon]} radius={selected?.id===f.id?9:6} pathOptions={{color:"#fff",weight:selected?.id===f.id?3:1.5,fillColor:colors[f.category]??colors.other,fillOpacity:.92}} eventHandlers={{click:()=>onSelect(f)}}><Popup><strong>{f.name}</strong><br/>{f.category}<br/>{f.address}<br/><a href={f.sourceUrl} target="_blank" rel="noreferrer">OpenStreetMap source</a></Popup></CircleMarker>)}</MapContainer>
}

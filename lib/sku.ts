const prefixes:Record<string,string>={Kleid:'KL',Bluse:'BL',Hose:'HO',Jeans:'JE',Rock:'RO',Jacke:'JA',Mantel:'MA',Tasche:'TA',Schuhe:'SH',Accessoire:'AC',Schmuck:'SC',Gürtel:'GU',Tuch:'TU'};
export function createSku(category:string){const prefix=prefixes[category]||'AR';const number=Math.floor(Date.now()/1000)%100000;return `MCP-${prefix}-${String(number).padStart(5,'0')}`;}

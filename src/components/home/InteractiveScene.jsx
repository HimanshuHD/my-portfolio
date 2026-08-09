import { Canvas } from '@react-three/fiber';
import { OrbitControls, RoundedBox, Sparkles } from '@react-three/drei';

const accent = '#d9ff54';
const DESK_TOP = 0.16;

function Laptop() {
  const rows = [['`','1','2','3','4','5','6','7','8','9','0'],['Q','W','E','R','T','Y','U','I','O','P'],['A','S','D','F','G','H','J','K','L'],['Z','X','C','V','B','N','M','<','>']];
  return <group position={[0, DESK_TOP + 0.1, -0.18]} rotation={[0,-0.08,0]}>
    <RoundedBox args={[3.45,0.16,2.1]} radius={0.08} smoothness={5} castShadow><meshStandardMaterial color="#24272a" metalness={0.82} roughness={0.22}/></RoundedBox>
    <RoundedBox args={[3.1,1.82,0.12]} radius={0.08} smoothness={5} position={[0,1.2,-0.96]} rotation={[-0.08,0,0]} castShadow><meshStandardMaterial color="#17191b" metalness={0.8} roughness={0.2}/></RoundedBox>
    <mesh position={[0,1.2,-0.89]} rotation={[-0.08,0,0]}><planeGeometry args={[2.82,1.56]}/><meshStandardMaterial color="#102033" emissive="#07131c" emissiveIntensity={0.65} roughness={0.3}/></mesh>
    {rows.map((row,ri)=>row.map((key,ki)=>{const width=ri===1?2.7:2.8;const spacing=width/row.length;return <RoundedBox key={`${ri}-${ki}`} args={[spacing-0.045,0.045,0.22]} radius={0.025} smoothness={2} position={[(ki-(row.length-1)/2)*spacing,0.25,-0.37+ri*0.26]}><meshStandardMaterial color={key==='F'||key==='J'?'#455019':'#34383b'} metalness={0.25} roughness={0.38}/></RoundedBox>;}))}
    <RoundedBox args={[0.9,0.035,0.5]} radius={0.04} smoothness={3} position={[0,0.24,0.63]}><meshStandardMaterial color="#303437" metalness={0.45} roughness={0.28}/></RoundedBox>
  </group>;
}

function Mug() {
  return <group position={[-2.45,DESK_TOP+0.35,0.55]}>
    <mesh castShadow><cylinderGeometry args={[0.42,0.37,0.66,48]}/><meshStandardMaterial color="#d9d5c9" roughness={0.62} metalness={0.04}/></mesh>
    <mesh position={[0,0.335,0]}><torusGeometry args={[0.385,0.035,16,48]}/><meshStandardMaterial color="#c9c4b9" roughness={0.5}/></mesh>
    <mesh position={[0,0.332,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[0.335,48]}/><meshStandardMaterial color="#171311" roughness={0.4}/></mesh>
    <mesh position={[0.43,0,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[0.22,0.065,18,40,Math.PI*1.72]}/><meshStandardMaterial color="#d0cbc0" roughness={0.55} metalness={0.04}/></mesh>
  </group>;
}

function RubiksCube() {
  const colors=['#d92828','#f2f2e8','#f1d12b','#168c46','#1769aa','#f07b21'];
  const cubies=[];for(let x=-1;x<=1;x++)for(let y=-1;y<=1;y++)for(let z=-1;z<=1;z++)cubies.push({x,y,z,id:`${x}${y}${z}`});
  return <group position={[2.05,DESK_TOP+0.5,0.42]} rotation={[0.2,-0.45,0.18]}>{cubies.map(({x,y,z,id})=><group key={id} position={[x*.31,y*.31,z*.31]}>
    <RoundedBox args={[.285,.285,.285]} radius={.035} smoothness={2} castShadow><meshStandardMaterial color="#17191a" metalness={.2} roughness={.35}/></RoundedBox>
    {x===1&&<mesh position={[.146,0,0]} rotation={[0,Math.PI/2,0]}><planeGeometry args={[.22,.22]}/><meshStandardMaterial color={colors[0]}/></mesh>}{x===-1&&<mesh position={[-.146,0,0]} rotation={[0,-Math.PI/2,0]}><planeGeometry args={[.22,.22]}/><meshStandardMaterial color={colors[3]}/></mesh>}{y===1&&<mesh position={[0,.146,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[.22,.22]}/><meshStandardMaterial color={colors[2]}/></mesh>}{y===-1&&<mesh position={[0,-.146,0]} rotation={[Math.PI/2,0,0]}><planeGeometry args={[.22,.22]}/><meshStandardMaterial color={colors[1]}/></mesh>}{z===1&&<mesh position={[0,0,.146]}><planeGeometry args={[.22,.22]}/><meshStandardMaterial color={colors[4]}/></mesh>}{z===-1&&<mesh position={[0,0,-.146]} rotation={[0,Math.PI,0]}><planeGeometry args={[.22,.22]}/><meshStandardMaterial color={colors[5]}/></mesh>}
  </group>)}</group>;
}

function Camera(){return <group position={[2.9,DESK_TOP+.32,-.62]} rotation={[.04,-.28,.05]}><RoundedBox args={[1,.62,.58]} radius={.08} smoothness={4} castShadow><meshStandardMaterial color="#202326" metalness={.62} roughness={.28}/></RoundedBox><RoundedBox args={[.36,.17,.31]} radius={.04} smoothness={3} position={[0,.39,0]}><meshStandardMaterial color="#292d30" metalness={.5} roughness={.3}/></RoundedBox><mesh position={[0,0,.32]} rotation={[Math.PI/2,0,0]} castShadow><cylinderGeometry args={[.27,.27,.19,32]}/><meshStandardMaterial color="#0b0d0f" metalness={.9} roughness={.12}/></mesh><mesh position={[0,0,.43]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.15,.15,.035,32]}/><meshStandardMaterial color="#69a3a9" emissive="#153c3e" emissiveIntensity={.55}/></mesh></group>;}

function Headphones(){return <group position={[-1.15,DESK_TOP+.55,1.18]} rotation={[0,.05,0]}><mesh rotation={[0,0,Math.PI/2]}><torusGeometry args={[.58,.065,18,56,Math.PI*1.35]}/><meshStandardMaterial color="#111315" metalness={.72} roughness={.2}/></mesh>{[-.49,.49].map(x=><group key={x} position={[x,-.02,0]}><RoundedBox args={[.3,.5,.34]} radius={.09} smoothness={4} castShadow><meshStandardMaterial color="#25282b" metalness={.65} roughness={.25}/></RoundedBox><mesh position={[0,0,.18]} rotation={[-Math.PI/2,0,0]}><cylinderGeometry args={[.12,.12,.035,24]}/><meshStandardMaterial color="#51565b" metalness={.3} roughness={.4}/></mesh></group>)}</group>;}

function Plant(){const leaves=[[-.2,.62,0,-.25,.15],[-.08,.83,0,-.1,-.05],[.08,.72,0,.18,.08],[.22,.9,0,.3,-.15],[0,1.02,0,0,.2],[-.28,.82,0,-.35,-.12]];return <group position={[-3,DESK_TOP,-.65]}><mesh position={[0,.28,0]} castShadow><cylinderGeometry args={[.43,.34,.56,32]}/><meshStandardMaterial color="#8b7562" roughness={.78}/></mesh><mesh position={[0,.57,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.39,32]}/><meshStandardMaterial color="#2c2119" roughness={.95}/></mesh><mesh position={[0,.8,0]}><cylinderGeometry args={[.035,.045,.75,10]}/><meshStandardMaterial color="#536b2d" roughness={.9}/></mesh>{leaves.map(([x,y,z,rx,rz],i)=><group key={i} position={[x,y,z]} rotation={[rx,0,rz]}><mesh scale={[.75,1.35,.14]} castShadow><sphereGeometry args={[.24,16,12]}/><meshStandardMaterial color={i%2?'#4f7d2d':'#658f37'} roughness={.82}/></mesh></group>)}</group>;}

function Lamp(){return <group position={[3.45,DESK_TOP,-.95]}><mesh position={[0,.06,0]} castShadow><cylinderGeometry args={[.38,.46,.12,32]}/><meshStandardMaterial color="#26282a" metalness={.72} roughness={.24}/></mesh><mesh position={[0,.64,0]} castShadow><cylinderGeometry args={[.045,.06,1.15,16]}/><meshStandardMaterial color="#34373a" metalness={.82} roughness={.22}/></mesh><mesh position={[0,1.18,0]} rotation={[.25,0,0]} castShadow><sphereGeometry args={[.22,24,16]}/><meshStandardMaterial color="#303336" metalness={.7} roughness={.25}/></mesh><mesh position={[0,1.1,.14]} rotation={[.25,0,0]}><coneGeometry args={[.34,.42,32,1,true]}/><meshStandardMaterial color="#b5a98f" roughness={.65} side={2}/></mesh><mesh position={[0,1.04,.2]} rotation={[.25,0,0]}><sphereGeometry args={[.11,24,16]}/><meshStandardMaterial color="#fff0bf" emissive="#ffbd58" emissiveIntensity={2.2}/></mesh><pointLight position={[0,1,.25]} color="#ffc76b" intensity={5} distance={3.8} castShadow/></group>;}

function Phone(){return <group position={[-2,DESK_TOP+.07,1.38]} rotation={[0,-.15,-.08]}><RoundedBox args={[.64,.08,1.18]} radius={.07} smoothness={5} castShadow><meshStandardMaterial color="#141719" metalness={.78} roughness={.2}/></RoundedBox><mesh position={[0,.047,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[.5,.96]}/><meshStandardMaterial color="#162a34" emissive="#082d34" emissiveIntensity={.8}/></mesh></group>;}

function Desk(){return <group><RoundedBox args={[8.2,.16,4.25]} radius={.22} smoothness={5} position={[0,.08,0]} receiveShadow><meshStandardMaterial color="#151719" metalness={.28} roughness={.38}/></RoundedBox><RoundedBox args={[8,.045,4.05]} radius={.18} smoothness={4} position={[0,.19,0]} receiveShadow><meshStandardMaterial color="#202326" metalness={.08} roughness={.5}/></RoundedBox><mesh position={[0,.215,0]} rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[7.8,3.85]}/><meshStandardMaterial color="#25282a" roughness={.48}/></mesh></group>;}

function SceneContent(){return <><color attach="background" args={['#06090c']}/><ambientLight intensity={.55} color="#dfe9ff"/><directionalLight position={[-4,7,4]} intensity={2.1} color="#d9e8ff" castShadow shadow-mapSize={[2048,2048]}/><pointLight position={[-3,2,2]} intensity={1.5} color="#d9ff54" distance={7}/><pointLight position={[3,2,-2]} intensity={1.8} color="#4d86ff" distance={7}/><Desk/><Laptop/><Mug/><RubiksCube/><Camera/><Headphones/><Plant/><Lamp/><Phone/><Sparkles count={35} scale={[7,2.4,4]} size={1.1} speed={.18} color="#d9ff54" opacity={.22}/></>;}

export default function InteractiveScene(){return <Canvas shadows camera={{position:[8.5,6.4,9.2],fov:42}} dpr={[1,1.75]} gl={{antialias:true}}><SceneContent/><OrbitControls enablePan={false} minDistance={7} maxDistance={13} minPolarAngle={Math.PI/4.8} maxPolarAngle={Math.PI/2.05} target={[0,.65,0]}/></Canvas>;}

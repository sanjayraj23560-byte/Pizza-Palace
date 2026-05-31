import { useNavigate, useLocation } from "react-router-dom"

const links = [
  { label: "Pizza",   path: "/pizza",   icon: "ti-pizza",         cls: "pizza"  },
  { label: "Drinks",  path: "/drinks",  icon: "ti-bottle",        cls: "drinks" },
  { label: "Home",    path: "/home",        icon: "ti-home-2",        cls: "home"   },
  { label: "Cart",    path: "/cart",    icon: "ti-shopping-cart", cls: "cart"   },
  { label: "Account", path: "/account", icon: "ti-user-circle",   cls: "acct"   },
]

const COLORS = { pizza:"#ff6464", drinks:"#ffc850", home:"#50b4ff", cart:"#a082ff", acct:"#3cdca0" }
const GLOWS  = { pizza:"rgba(255,100,100,0.7)", drinks:"rgba(255,200,80,0.7)", home:"rgba(80,180,255,0.7)", cart:"rgba(160,130,255,0.7)", acct:"rgba(60,220,160,0.7)" }

const Navbar = () => {
  const navi     = useNavigate()
  const location = useLocation()

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 990,
    }}>
      <svg viewBox="0 0 1200 58" preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display:"block", width:"100%", height:38, marginBottom:0 }}>
        <defs>
          <linearGradient id="navRainbow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#ff6464"/>
            <stop offset="25%"  stopColor="#ffc850"/>
            <stop offset="50%"  stopColor="#50b4ff"/>
            <stop offset="75%"  stopColor="#a082ff"/>
            <stop offset="100%" stopColor="#3cdca0"/>
          </linearGradient>
          <linearGradient id="navBg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#1a0a0a"/>
            <stop offset="25%"  stopColor="#1a1408"/>
            <stop offset="50%"  stopColor="#08101a"/>
            <stop offset="75%"  stopColor="#0e0a1a"/>
            <stop offset="100%" stopColor="#0a1814"/>
          </linearGradient>
        </defs>
        <path d="M0,46 Q300,8 600,4 Q900,8 1200,46 L1200,58 L0,58 Z" fill="url(#navBg)"/>
        <path d="M0,46 Q300,8 600,4 Q900,8 1200,46"
          fill="none" stroke="url(#navRainbow)" strokeWidth="2.5"/>
      </svg>

      <div style={{
        background: "#0e0b08",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "2px 8px 14px",
      }}>
        {links.map(({ label, path, icon, cls }) => {
          const active = location.pathname === path
          return (
            <div key={path} onClick={() => navi(path)} style={{
              display:"flex", flexDirection:"column", alignItems:"center", gap:3,
              padding:"2px 12px", flex:1, cursor:"pointer", userSelect:"none",
              transform: active ? "translateY(-3px)" : "translateY(0)",
              transition:"transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            }}>
              <i className={`ti ${icon}`} style={{
                fontSize: 20,
                color: active ? COLORS[cls] : "rgba(255,255,255,0.28)",
                filter: active ? `drop-shadow(0 0 7px ${GLOWS[cls]})` : "none",
                transition: "color 0.25s, filter 0.25s",
              }}/>
              <span style={{
                fontSize:"9px", fontWeight:600, letterSpacing:"0.07em",
                textTransform:"uppercase",
                color: active ? COLORS[cls] : "rgba(255,255,255,0.22)",
                textShadow: active ? `0 0 10px ${GLOWS[cls]}` : "none",
                transition:"color 0.25s, text-shadow 0.25s",
              }}>{label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Navbar
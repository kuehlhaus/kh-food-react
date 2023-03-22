import { Link } from 'react-router-dom';
import Pebble2 from '../assets/img/Pebble2.svg';
import Footerds from '../assets/img/Footer.svg';

export default function Footer() {
  return (
    <footer>
      <div className="footer">
        <button>
          <img src={Footerds} alt="" />
        </button>
        <Link>Impressum</Link>
        <Link>Datenschutz</Link>
      </div>
    </footer>
  );
}

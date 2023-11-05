import logo from 'mastodon/../images/logos/logo_dark.png';
import wordmark from 'mastodon/../images/logos/wordmark_dark.png';

export const WordmarkLogo: React.FC = () => (
  <img src={wordmark} alt='Whippy Edition' className='logo logo--wordmark' />
);

export const SymbolLogo: React.FC = () => (
  <img src={logo} alt='Whippy Edition' className='logo logo--icon' />
);

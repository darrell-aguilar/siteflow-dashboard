import { useState } from 'react';
import './App.css';
import PopUp from './components/PopUp';
import PrinterTable from './components/PrinterTable';
import UserTable from './components/UserTable';

function App() {
  const [currentTab, setCurrentTab] = useState('Printers')
  const [sites, setSites] = useState(process.env.REACT_APP_SITES.split(' '))
  const [site, setSite] = useState(sites[0])
  const [messages, setMessages] = useState([])
  const handleClick = (e) => {
    setCurrentTab(e.target.innerText)
  }

  const handleChange = (e) => {
    setSite(e.target.value)
  }

  return (
    <div className="App w-100">
      <div className='py-4 d-flex flex-md-row flex-column container justify-content-between position-relative w-100'>
        <PopUp messages={messages} setMessages={setMessages}/>
        <h1>Siteflow Dashboard</h1>
        <div>
          <h5>Select Site</h5>
          <select onChange={handleChange} className='py-0 custom-select'>
            {sites.map(site => 
                <option key={site} value={site}>{site}</option>
              )}            
          </select>
        </div>
      </div>
      <div className='d-flex align-items-center justify-content-center gap-3 my-3'>
        <button className={`btn ${currentTab === 'Printers' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={handleClick}>Printers</button>
        <button className={`btn ${currentTab === 'Users' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={handleClick}>Users</button>
      </div>
      {currentTab === 'Printers' ?
      <PrinterTable setMessages={setMessages} site={site} tableHead={["Name", "Device Name", "IP Address", "Type", "Orientation", "Port", "ZPL", "Active", "Send To Press"]}/>
      :
      <UserTable site={site} tableHead={["Name", "Username", "Email", "ProdUser", "Active"]} />
      }
    </div>
  );
}

export default App;

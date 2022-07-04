import React, {useState, useEffect} from 'react'

export default function UserTable({tableHead, site}) {

    const [users, setUsers] = useState('')
    const [activeOnly, setActiveOnly] = useState(false)
    const [showFilter, setShowFilter] = useState(false)
    const [search, setSearch] = useState('')

    useEffect(() => {
        const fetchUsers= async () => {
            const myUsers = await fetch(`/api/user?site=${site}`)
                                        .then(res => res.json())
                                            .catch(err => console.log(err))
            setUsers(myUsers.data)
        }
        fetchUsers()
    }, [site])

    const toggleFilter = () => {
        setShowFilter(!showFilter)
        if (!showFilter) {
            document.querySelector('#filterToggle').classList.remove('d-none')
        }
        else document.querySelector('#filterToggle').classList.add('d-none')
    }

    return (
        <div className='container'>
            <input className='px-3 py-2 mb-3 w-50' onChange={(e) => setSearch(e.target.value.toLowerCase())} placeholder="Search to filter by user"/>
            <br/>
            <button className='btn btn-secondary mb-3' onClick={() => toggleFilter()}>Show Filters</button>
                <div id="filterToggle" className='d-flex align-items-center justify-content-center d-none'>
                    <div className='form-check'>
                        <label className='m-2'>Active Only</label>
                        <input type="checkbox" onChange={() => setActiveOnly(!activeOnly)}></input>
                    </div>
                </div>
            <table className="table">
                <thead className='table-dark'> 
                    <tr>
                        {tableHead.map(header => 
                            <th key={header} scope="col">{header}</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {users !=='' && 
                    users.filter(user => user.name.toLowerCase().includes(search) || user.username.toLowerCase().includes(search) || search === '').filter(user => activeOnly === true ? user.active.toString().includes('true') : true).map((user, index) => 
                        <tr key={index}>
                            <th>{user.name}</th>
                            <th>{user.username}</th>
                            <th>{user.email}</th>
                            <th>{user.productionUser.toString()}</th>
                            <th>{user.active.toString()}</th>
                        </tr>
                        )}
                </tbody>
            </table>
        </div>
    )
}

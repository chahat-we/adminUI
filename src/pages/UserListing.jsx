import React, {useState,useEffect} from 'react'
import '../App.css'
import trashBag from '../images/icons8-waste-48.png';
import editProfile from '../images/icons8-edit-profile-80.png';
import Modal from '../components/Modal'
import Loading from './Loading';

function UserListing() {
  const [url] = useState('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [users, setUsers] = useState([])
  
  const [pageIndex, setPageIndex] = useState(0)
  const [query, setQuery] = useState('')
  const [queryResult, setQueryResult] = useState([])
  const [searchParams] = useState(['name','email','role'])
  const [isModelOpen, setIsModelOpen] = useState(false)
  const [initialModelContent, setInitialModelContent] = useState({})
  const [modelContent, setModelContent] = useState({})

  //handle all checked users
  const handleCheck = (e) => {
      const newUsers = users.map((page,index)=> {
        if(index===pageIndex){
          return page.map((user)=>{
            if(user.id===e.target.value){
              user.isChecked = e.target.checked
              return user
            }
            return user
          })
        }
        return page
      })
      console.log(newUsers);
      setQueryResult(newUsers)
      setUsers(newUsers)
  }
  //handle model close
  const handleCancel = () => {
    setIsModelOpen(false)
    setModelContent({})
  }
  //handle model update
  const handleUpdate = () => {
    const newUsers = users.map((user,index)=> {
      if(index===Number(pageIndex)){
        return user.map((user)=>{
          if(user.id===modelContent.id){
            return modelContent
          }
          return user
        })
      }
      return user
    })
    setUsers(newUsers)
    setQueryResult(newUsers)
    setIsModelOpen(false)
    setModelContent({})
  }
  //handle updated user
  const handleEdit = (e) => {
    const newUser = {...modelContent, [e.target.name]: e.target.value}
    setModelContent(newUser)
  }
  //handle edit event
  const handleEditClick = (id) => {
    const user = users[pageIndex].filter((user)=>user.id===id)[0]
    // console.log(user);
    setInitialModelContent(user)
    setModelContent(user)
    setIsModelOpen(true)
  }
  //handle delete of a user
  const handleDelete = (id) => {
    const newUsers = users.map((user,index)=> {
      if(index===Number(pageIndex)){
        return user.filter((user)=>user.id!==id)
      }
      return user
    })
    setUsers(createChunks(unchunck(newUsers),10))
    setQueryResult(createChunks(unchunck(newUsers),10))
  }
  // deleted selected users
  const handleDeleteMultiple = () => {
    // const newUsers = users.filter(user=> !(checked.includes(user.id)))
    const newUsers = users.map((page,index)=> {
      if(index===pageIndex){
        return page.filter((user)=> !(user.isChecked))
      }
      return page
    })
    console.log(createChunks(unchunck(newUsers),10));
    setQueryResult(createChunks(unchunck(newUsers),10))
    setUsers(createChunks(unchunck(newUsers),10))
    document.getElementById("global-checkbox").checked = false;
    // setChecked([])
  }
  // select all users
  const handleSelectAll = (e) => {
    const newUsers = users.map((page,index)=> {
      if(index===pageIndex){
        return page.map(v => ({...v, isChecked: e.target.checked}))
      }
      return page
    })
    console.log(newUsers);
    setQueryResult(createChunks(unchunck(newUsers),10))
    setUsers(createChunks(unchunck(newUsers),10))
  }
  // convert 1D array to 2D array
  const createChunks = (data,size) => {
    let i = 0
    const res = []
    while(i<=data.length){
      res.push(data.slice(i,i+size))
      i += size;
    }
    const remaining = data%size
    if(remaining>0){
      res.push(data.slice(-remaining))
    }
    return res;
  }
  // convert 2D array to 1D array
  const unchunck = (data) => {
    const res = []
    data.forEach(element => {
      element.forEach(el => {
        res.push(el)
      });
    });
    return res
  }
  // handle search results
  const handleSearch = (e) => {
    const data = unchunck(users)
    const newUsers = data.filter((user) => {
      return searchParams.some((searchParam) => {
        return (
            user[searchParam]
              .toString()
              .toLowerCase()
              .indexOf((e.target.value).toLowerCase()) > -1
        );
      });
    });
    setQueryResult(()=>createChunks(newUsers,10))
    setPageIndex(0)
    console.log(createChunks(newUsers,10));
  }
  
  useEffect(() => {
    const fetchData = async()=>{
      setLoading(true)
      setError(false)
      try {
        const response = await fetch(url)
        const data = await response.json()
        const updatedData = data.map(v => ({...v, isChecked: false}))
        setUsers(()=>createChunks(updatedData,10))
        setQueryResult(()=>createChunks(updatedData,10))
        setLoading(false)
        
      } catch (err) {
        setLoading(false)
        setError(true)
      }
    }
    const timer = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(timer);
  }, [url])
  if(loading){
    return <Loading/>
  }
  if(error){
    return <Loading/>
  }
  return (
    <div style={{padding:'30px',position:'relative', backgroundColor:"#212121", height:'100vh'}}>
      <input 
        type="search" 
        name="search-form" 
        value={query} 
        className='searchbox' 
        placeholder='Search by name or email or role'
        onChange={(e) => {
          setQuery(e.target.value)
          return handleSearch(e)
        }}
        />
        {/* <button className='delete-all-btn' onClick={handleSearch}>Search</button> */}
      <table className="styled-table" style={{width:"100%", backgroundColor:"#fff"}}>
        <thead>
          <tr>
            <th><input type="checkbox" id='global-checkbox' onChange={handleSelectAll}/></th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {setQueryResult>0 ? users[pageIndex].map((user)=>{
            const {id,name,email,role,isChecked} = user
            return <tr key={id} className={isChecked ?'active-row' : ''}>
                <td><input value={id} type="checkbox" checked={isChecked} onChange={handleCheck}/></td>
                <td>{name}</td>
                <td>{email}</td>
                <td style={{textTransform: 'capitalize'}}>{role}</td>
                <td>
                  <img className='action-icon' src={trashBag} height="25px" onClick={()=>handleDelete(id)} alt="trash icon" />&emsp;&emsp;
                  <img className='action-icon' src={editProfile} height="25px" alt="edit icon" /></td>
              </tr>
          }): queryResult[pageIndex].map((user)=>{
            const {id,name,email,role,isChecked} = user
            return <tr key={id} className={isChecked ?'active-row' : ''}>
                <td><input value={id} type="checkbox" checked={isChecked} onChange={handleCheck}/></td>
                <td>{name}</td>
                <td>{email}</td>
                <td style={{textTransform: 'capitalize'}}>{role}</td>
                <td>
                  <img className='action-icon' src={trashBag} height="25px" onClick={()=>handleDelete(id)} alt="trash icon" />&emsp;&emsp;
                  <img className='action-icon' src={editProfile} height="25px" onClick={()=>handleEditClick(id)} alt="edit icon" /></td>
              </tr>
          })}
        </tbody>
        <tfoot>
          <tr>
            <td><button className='delete-all-btn' onClick={handleDeleteMultiple}>Delete Selected</button></td>
            <td colSpan="4">
              <div className="pagination">
                <p className='navigation-btn' style={ pageIndex===0 ?  { visibility: 'hidden' } : { display:'block'} } onClick={()=>setPageIndex(0)}>&laquo;</p>
                <p className='navigation-btn' style={ pageIndex===0 ?  { visibility: 'hidden' } : { display:'block'} }  onClick={()=>setPageIndex((oldPageIndex)=>oldPageIndex-1)}>&lsaquo;</p>
                {setQueryResult>0 ? users.map((_,index)=>{
                  return <p key={index} onClick={()=>setPageIndex(index)} className={pageIndex===index? 'active': ''}>{index+1}</p>
                }): queryResult.map((_,index)=>{
                  return <p key={index} onClick={()=>setPageIndex(index)} className={pageIndex===index? 'active': ''}>{index+1}</p>
                })}
                <p className='navigation-btn' style={ queryResult.length===pageIndex+1 ?  { visibility: 'hidden' } : { display:'block'} }   onClick={()=>setPageIndex((oldPageIndex)=>oldPageIndex+1)}>&rsaquo;</p>
                <p className='navigation-btn' style={ queryResult.length===pageIndex+1 ?  { visibility: 'hidden' } : { display:'block'} } onClick={()=>setPageIndex((oldPageIndex)=>queryResult.length-1)}>&raquo;</p>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
      {isModelOpen && <Modal info={modelContent} handleEdit={handleEdit} handleCancel={handleCancel} handleUpdate={handleUpdate} modelContent={modelContent} initialModelContent={initialModelContent}  />}
    </div>
  )
}

export default UserListing
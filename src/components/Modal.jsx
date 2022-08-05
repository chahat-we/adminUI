import React from 'react'

function Modal({info:user, handleEdit, handleCancel, handleUpdate, modelContent, initialModelContent}) {
  const { name, email, role } = user
  return (
    <div className='modal-overlay'>
      <div className="modal">
        <div className="modal-content">
            <input type="text" name='name' placeholder='name' className='modal-input' value={name} onChange={handleEdit}/>
            <input type="text" name='email' placeholder='email' className='modal-input' value={email} onChange={handleEdit}/>
            <input type="text" name='role' placeholder='role' className='modal-input' value={role} onChange={handleEdit}/>

            <div className='action-btns'>
              <button className='btn cancel-btn' onClick={handleCancel}>cancel</button>
              <button className={JSON.stringify(modelContent) === JSON.stringify(initialModelContent) ? 'btn update-btn disable': 'btn update-btn'} onClick={handleUpdate} disabled={JSON.stringify(modelContent) === JSON.stringify(initialModelContent)}>update</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal
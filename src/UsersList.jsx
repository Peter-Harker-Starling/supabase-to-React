import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

function UsersList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [creating, setCreating] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [updating, setUpdating] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  // Fetch all users
  async function fetchUsers() {
    setLoading(true)
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('id', { ascending: true })
    setUsers(data || [])
    setError(error ? error.message : null)
    setLoading(false)
  }

  // Create a new user
  async function handleCreate(e) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    setCreating(true)
    const { error } = await supabase
      .from('users')
      .insert([{ name, email }])
    setCreating(false)
    if (!error) {
      setName('')
      setEmail('')
      fetchUsers()
    } else {
      setError(error.message)
    }
  }

  // Delete a user
  async function handleDelete(id) {
    setDeletingId(id)
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)
    setDeletingId(null)
    if (!error) {
      fetchUsers()
    } else {
      setError(error.message)
    }
  }

  // Start editing a user
  function startEdit(user) {
    setEditingId(user.id)
    setEditName(user.name || '')
    setEditEmail(user.email || '')
  }

  // Cancel editing
  function cancelEdit() {
    setEditingId(null)
    setEditName('')
    setEditEmail('')
  }

  // Update a user
  async function handleUpdate(id) {
    if (!editName.trim() || !editEmail.trim()) return
    setUpdating(true)
    const { error } = await supabase
      .from('users')
      .update({ name: editName, email: editEmail })
      .eq('id', id)
    setUpdating(false)
    if (!error) {
      setEditingId(null)
      setEditName('')
      setEditEmail('')
      fetchUsers()
    } else {
      setError(error.message)
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Users List</h2>
      <form onSubmit={handleCreate} className="flex flex-col md:flex-row gap-2 mb-6 items-center justify-center">
        <input type="text" placeholder="Name" value={name}
          className="border rounded px-3 py-2 flex-1 min-w-0"
          onChange={e => setName(e.target.value)}
          disabled={creating}/>
        <input type="email" placeholder="Email" value={email}
          className="border rounded px-3 py-2 flex-1 min-w-0"
          onChange={e => setEmail(e.target.value)}
          disabled={creating}/>
        <button type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={creating}>
          {creating ? 'Adding...' : 'Add User'}
        </button>
      </form>
      {loading ? (<div className="text-center">Loading...</div>) : error ? 
      (<div className="text-red-500 text-center">Error: {error}</div>) : (
        <ul className="divide-y divide-gray-200">
          {users.map(user => (
            <li key={user.id} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              {editingId === user.id ? (
                <div className="flex flex-col md:flex-row md:items-center gap-2 w-full">
                  <input type="text" value={editName}
                    className="border rounded px-2 py-1 flex-1 min-w-0"
                    onChange={e => setEditName(e.target.value)}
                    disabled={updating}/>
                  <input type="email" value={editEmail}
                    className="border rounded px-2 py-1 flex-1 min-w-0"
                    onChange={e => setEditEmail(e.target.value)}
                    disabled={updating}/>
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50"
                    onClick={() => handleUpdate(user.id)}
                    disabled={updating}>
                    {updating ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
                    onClick={cancelEdit}
                    disabled={updating}>
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-2">
                  <div>
                    <span className="font-semibold">Name:</span> {user.name || <span className="text-gray-400">(no name)</span>}<br />
                    <span className="font-semibold">Email:</span> {user.email || <span className="text-gray-400">(no email)</span>}
                  </div>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <button
                      className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                      onClick={() => startEdit(user)}
                      disabled={editingId !== null}>
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                      onClick={() => handleDelete(user.id)}
                      disabled={deletingId === user.id}>
                      {deletingId === user.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default UsersList 
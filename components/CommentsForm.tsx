import React, { useState, useEffect } from 'react'
import { submitComment } from '../services'

const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/

interface Slug {
  slug: string
}

const CommentsForm = ({ slug }: { slug: Slug }) => {
  const [error, setError] = useState<boolean>(false)
  const [fake, setFake] = useState<boolean>(false)
  const [submit, setSubmit] = useState<boolean>(false)
  const [localStorage, setLocalStorage] = useState<any>(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false)
  const [formData, setFormData] = useState({
    name: null,
    email: null,
    comment: null,
    storeData: false,
  })

  useEffect(() => {
    setLocalStorage(window.localStorage)
    const initalFormData: any = {
      name: window.localStorage.getItem('name'),
      email: window.localStorage.getItem('email'),
      storeData:
        window.localStorage.getItem('name') ||
        window.localStorage.getItem('email'),
    }
    setFormData(initalFormData)
  }, [])

  const onInputChange = (e: { target: any }) => {
    const { target } = e
    if (target.type === 'checkbox') {
      setFormData((prevState) => ({
        ...prevState,
        [target.name]: target.checked,
      }))
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [target.name]: target.value,
      }))
    }
  }

  const handlePostSubmission = () => {
    setError(false)
    setFake(false)
    setSubmit(false)
    const { name, email, comment, storeData }: any = formData
    if (!name || !email || !comment) {
      setError(true)
      setSubmit(false)
    } else if (email.match(pattern)) {
      setFake(false)
      setSubmit(true)
    } else {
      setFake(true)
      setSubmit(false)
    }
    const commentObj = {
      name,
      email,
      comment,
      slug,
    }

    if (storeData) {
      localStorage.setItem('name', name)
      localStorage.setItem('email', email)
    } else {
      localStorage.removeItem('name')
      localStorage.removeItem('email')
    }

    if (fake === false && submit === true) {
      submitComment(commentObj).then((res) => {
        if (res.createComment) {
          if (!storeData) {
            formData.name = '' as unknown as null
            formData.email = '' as unknown as null
          }
          formData.comment = '' as unknown as null
          setFormData((prevState) => ({
            ...prevState,
            ...formData,
          }))
          setShowSuccessMessage(true)
          setTimeout(() => {
            setShowSuccessMessage(false)
          }, 3000)
        }
      })
    }
  }

  return (
    <div className="mb-8 rounded-lg bg-white p-8 pb-12 shadow-lg">
      <h3 className="mb-8 border-b pb-4 text-xl font-semibold">
        Leave a Reply
      </h3>
      <div className="mb-4 grid grid-cols-1 gap-4">
        <textarea
          value={formData.comment}
          onChange={onInputChange}
          className="h-40 w-full rounded-lg bg-gray-100 p-4 text-gray-700 outline-none focus:ring-2 focus:ring-gray-200"
          name="comment"
          placeholder="Comment"
        />
      </div>
      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <input
          type="text"
          value={formData.name}
          onChange={onInputChange}
          className="w-full rounded-lg bg-gray-100 py-2 px-4 text-gray-700 outline-none focus:ring-2 focus:ring-gray-200"
          placeholder="Name"
          name="name"
        />
        <input
          type="email"
          value={formData.email}
          onChange={onInputChange}
          className="w-full rounded-lg bg-gray-100 py-2 px-4 text-gray-700 outline-none focus:ring-2 focus:ring-gray-200"
          placeholder="Email"
          name="email"
        />
      </div>
      <div className="mb-4 grid grid-cols-1 gap-4">
        <div>
          <input
            checked={formData.storeData}
            onChange={onInputChange}
            type="checkbox"
            id="storeData"
            name="storeData"
            value="true"
          />
          <label className="cursor-pointer text-gray-500" htmlFor="storeData">
            {' '}
            Save my name, email in this browser for the next time I comment.
          </label>
        </div>
      </div>
      {error && (
        <p className="text-xs text-red-500">All fields are mandatory</p>
      )}
      {fake && (
        <p className="text-xs text-red-500">Please enter valid email address</p>
      )}
      <div className="mt-8">
        <button
          type="button"
          onClick={handlePostSubmission}
          className="ease bg-pink inline-block cursor-pointer rounded-full px-8 py-3 text-lg font-medium text-white transition duration-500 hover:bg-black"
        >
          Post Comment
        </button>
        {showSuccessMessage && (
          <span className="float-right mt-3 text-xl font-semibold text-green-500">
            Comment submitted for review
          </span>
        )}
      </div>
    </div>
  )
}

export default CommentsForm

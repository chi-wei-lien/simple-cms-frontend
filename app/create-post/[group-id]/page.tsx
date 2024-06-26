'use client'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'

import PostTableView from '@/app/components/PostTableView'
import editPost from '@/app/lib/editPost'
import getGroup from '@/app/lib/getGroup'

import FieldJsonView from '../../components/FieldJsonView'
import { PostFormValues } from '../../types/field'

interface CreatePostProps {
  params: { 'group-id': string }
}

const CreatePost = ({ params }: CreatePostProps) => {
  const { data: session } = useSession()

  const [view, setView] = useState('tableView')
  const [ready, setReady] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const groupId = decodeURIComponent(
    (params['group-id'] + '').replace(/\+/g, '%20')
  )
  const callbackUrl = `/group/${groupId}`

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PostFormValues>({
    defaultValues: {
      fields: [],
    },
    mode: 'onBlur',
  })
  const { fields } = useFieldArray({
    name: 'fields',
    control,
  })

  const onSubmit = async (formData: PostFormValues) => {
    setSubmitting(true)
    const isoDateString = new Date().toISOString()
    const postId = `post-${isoDateString}`
    await editPost(groupId, postId, formData, session, false)
    router.push(callbackUrl)
  }

  const fetchGroup = async () => {
    const group = await getGroup(params['group-id'])
    const fields = group.fields
    setValue('fields', fields)
    setReady(true)
  }

  useEffect(() => {
    fetchGroup()
  }, [])

  const watchField = watch('fields')

  return (
    <div className="d-flex justify-content-center mt-4">
      <div className="shadow p-3 mb-5 rounded">
        <h3>Create Post</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="mt-3">Post Content</label>
          <ul className="nav nav-tabs mt-3">
            <li className="nav-item">
              <button
                className={
                  'nav-link ' +
                  (view == 'jsonView' ? 'text-secondary' : 'active text-black')
                }
                onClick={(e) => {
                  e.preventDefault()
                  setView('tableView')
                }}
              >
                Table View
              </button>
            </li>
            <li className="nav-item">
              <button
                className={
                  'nav-link ' +
                  (view == 'jsonView' ? 'active text-black' : 'text-secondary')
                }
                onClick={(e) => {
                  e.preventDefault()
                  setView('jsonView')
                }}
              >
                JSON View
              </button>
            </li>
          </ul>
          <div className="" style={{ width: '800px' }}>
            {view == 'tableView' && (
              <PostTableView
                ready={ready}
                fields={fields}
                register={register}
                control={control}
              />
            )}
            {view == 'jsonView' && <FieldJsonView fields={watchField} />}
            <div className="mt-4">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  router.push(callbackUrl)
                }}
                className="btn btn-light"
                disabled={submitting}
              >
                cancel
              </button>
              <input
                type="submit"
                className="btn btn-dark ms-2"
                disabled={submitting}
                value={submitting ? 'saving' : 'save'}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePost

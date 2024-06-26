'use server'

import Link from 'next/link'

import getGroups from '../lib/getGroups'
import Documentation from './Documentation'

const NoGroupMessage = (
  <tr>
    <td colSpan={4}>
      There are currently no groups yet! Create one by using the &quot;Create
      Post Group&quot; button above.
    </td>
  </tr>
)

const replacer = (key: string, value: string) => {
  if (key == 'editUrl') return undefined
  else if (key == 'postUrl') return undefined
  else return value
}

const PostGroupDashboard = async () => {
  const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/get-groups?`
  const sampleRequest = `const response = await fetch('${apiUrl}', {
  method: 'GET'
})
const data = await response.json()`
  const groups = await getGroups()
  const sampleResponse = JSON.stringify(groups, replacer, '\t')

  return (
    <div>
      <div className="d-flex justify-content-end">
        <Link href="/create-group" className="btn btn-dark mt-2">
          Create Post Group
        </Link>
      </div>
      <div className="mt-3" style={{ width: '800px' }}>
        <table className="table">
          <thead className="table-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Group Name</th>
              <th scope="col">Last Modified</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {groups.length == 0 && NoGroupMessage}
            {groups.map((group, index) => {
              return (
                <tr key={index + 1}>
                  <th scope="row">{index + 1}</th>
                  <td>{group.groupName}</td>
                  <td>{group.createdOn.substring(0, 10)}</td>
                  <td>
                    <a
                      href={group.editUrl}
                      className="btn btn-light"
                      type="button"
                    >
                      edit
                    </a>
                    <a
                      href={group.postUrl}
                      className="btn btn-dark ms-2"
                      type="button"
                    >
                      posts
                    </a>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <Documentation
        sampleRequest={sampleRequest}
        sampleResponse={sampleResponse}
      />
    </div>
  )
}

export default PostGroupDashboard

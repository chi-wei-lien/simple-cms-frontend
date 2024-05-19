'use client'
import { FieldArrayWithId, UseFormRegister } from 'react-hook-form'

import { PostFormValues } from '../types/field'

interface FieldTableViewParam {
  fields: FieldArrayWithId<PostFormValues, 'fields', 'id'>[]
  register: UseFormRegister<PostFormValues>
}

const NoFieldMessage = (
  <tr>
    <td colSpan={5}>
      This post group does not have any field yet. Edit the post group to create
      meaningful posts!
    </td>
  </tr>
)

const PostTableView = ({ register, fields }: FieldTableViewParam) => {
  return (
    <table className="table">
      <thead className="table-dark">
        <tr>
          <th scope="col">#</th>
          <th scope="col">Field Name</th>
          <th scope="col">Data Type</th>
          <th scope="col">Content</th>
        </tr>
      </thead>
      <tbody>
        {fields.length == 0 && NoFieldMessage}
        {fields.map((field, index) => {
          return (
            <tr key={field.id + 1}>
              <th scope="row">{index + 1}</th>
              <td>
                <div>{fields[index].name}</div>
              </td>
              <td>
                <div>{fields[index].dataType}</div>
              </td>
              <td>
                <input
                  className="form-control"
                  {...register(`fields.${index}.content` as const, {
                    required: true,
                  })}
                ></input>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default PostTableView
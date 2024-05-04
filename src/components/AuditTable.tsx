import { useMemo, type PropsWithChildren } from 'react'
import styled from 'styled-components'
import { groupBy } from 'lodash-es'
import type { Email } from '../types/Email'
import NameDisplay from './NameDisplay'

type NameTableProps = PropsWithChildren<{ emails: Email[] }>

function NameTable({ emails, ...rest }: NameTableProps) {
  
  const emailsByDate = useMemo(
    () =>
      groupBy<Email>(emails, ({ datetime }) =>
        new Date(datetime).toLocaleDateString(),
      ),
    [emails],
  )

  return (
    <table {...rest}>
      <thead>
        <tr>
          <th>Sender</th>
          <th>Recipients</th>
          <th>Subject</th>
          <th className="align-right">Date</th>
          <th className="align-right">Time</th>
        </tr>
      </thead>
      {Object.entries(emailsByDate).map(([datetime, emailGroup]) => (
        <tbody key={datetime}>
          {emailGroup.map(({ id, from, to: recipients, subject, datetime }) => (
            <tr key={id}>
              <td>{from}</td>
              <td>
                <NameDisplay recipients={recipients} />
              </td>
              <td>{subject}</td>
              <td className="align-right"></td>
              <td className="align-right"></td>
            </tr>
          ))}
        </tbody>
      ))}
    </table>
  )
}

export default styled(NameTable)`
  table-layout: fixed;
  border: var(--border-style);
  border-spacing: 0;
  width: 100%;
  text-align: left;

  th,
  td {
    border: var(--border-style);
    padding: 5px 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    height: 34px;
    box-sizing: border-box;
  }

  th {
    &:nth-child(1) {
      width: 20%;
    }
    &:nth-child(2) {
      width: 30%;
    }
    &:nth-child(3) {
      width: 50%;
    }
    &:nth-child(4) {
      width: 90px;
    }
    &:nth-child(5) {
      width: 70px;
    }
  }

  tbody:nth-child(even) {
    background-color: #e0f5e8;
  }

  .align-right {
    text-align: right;
  }
`

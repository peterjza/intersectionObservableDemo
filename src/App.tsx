import './app.css'
import NameTable from './components/AuditTable'
import FakeData from './data'

export default function App() {
  return (
    <main>
      <h1>Hello celebs</h1>
      <NameTable emails={FakeData} />
    </main>
  )
}

import { PageHeader } from '@/components/layout/PageHeader'
import { EntryForm } from '@/components/entry/EntryForm'

export function NewEntry() {
  return (
    <>
      <PageHeader title="New entry" showBack />
      <EntryForm />
    </>
  )
}

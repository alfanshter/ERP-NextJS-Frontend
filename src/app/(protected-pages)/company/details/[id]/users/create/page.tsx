import CompanyUserCreate from './_components/CompanyUserCreate'

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    return <CompanyUserCreate companyId={id} />
}

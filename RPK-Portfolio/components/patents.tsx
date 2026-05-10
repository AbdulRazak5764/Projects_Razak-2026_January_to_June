export function Patents() {
  const patents = [
    {
      title: 'Digital Air Pollution Detection Device',
      applicationNo: '396602-001',
      inventors: 'Sweta Dey, Kalyan Chatterjee, Ramagiri Praveen Kumar, et al.',
      date: '22/12/2023',
      status: 'Design Patent Accepted',
    },
    {
      title: 'SleeDAS: ML-based Sleepiness Detection & Wake-up Alert System with an active Wristband',
      applicationNo: '202341059586',
      inventors: 'Kalyan Chatterjee, M. Raju, Ramagiri Praveen Kumar, et al.',
      date: '06.10.2023',
      status: 'Filed',
    },
  ]

  return (
    <section id="patents" className="py-16 md:py-24 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-foreground mb-12">Patents</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {patents.map((patent, idx) => (
            <div key={idx} className="bg-card border border-border rounded-lg p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-foreground mb-2">{patent.title}</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground"><strong>Application No:</strong> {patent.applicationNo}</p>
                  <p className="text-muted-foreground"><strong>Filed:</strong> {patent.date}</p>
                  <p className="text-accent"><strong>Status:</strong> {patent.status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

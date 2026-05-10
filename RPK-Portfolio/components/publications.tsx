'use client'

import { useState } from 'react'

export function Publications() {
  const [expanded, setExpanded] = useState<number | null>(null)

  const publications = [
    {
      title: 'APICT: Air Pollution Epidemiology using Green AQI Prediction during Winter Seasons in India',
      authors: 'Sweta Dey, Kalyan Chatterjee, Ramagiri Praveen Kumar, Bandyopadhyay Anjan, Sujata Swain, Neeraj Kumar',
      journal: 'IEEE Transactions on Sustainable Computing',
      year: '2024',
      doi: '10.1109/TSUSC.2023.3343922',
      link: 'https://doi.org/10.1109/TSUSC.2023.3343922',
    },
    {
      title: 'Future Air Quality Prediction using Long Short-Term Memory based on Hyper Heuristic Multi-Chain Model',
      authors: 'Kalyan Chatterjee, Samla Suraj Kumar, Ramagiri Praveen Kumar, Anjan Bandyopadhyay, Sujata Swain, Saurav Mallik, Amal Al-Rasheed, Mohamed Abbas, Ben Othman Soufiene',
      journal: 'IEEE Access',
      year: '2024',
      doi: '10.1109/ACCESS.2024.3441109',
      link: 'https://doi.org/10.1109/ACCESS.2024.3441109',
    },
    {
      title: 'PDD-ET: Parkinson\'s Disease Detection Using ML Ensemble Techniques and Customized Big Dataset',
      authors: 'Kalyan Chatterjee, Ramagiri Praveen Kumar, Anjan Bandyopadhyay, Sujata Swain, Saurav Mallik, Aimin Li, Kanad Ray',
      journal: 'Information',
      year: '2023',
      volume: '14(9), 502',
      doi: '10.3390/info14090502',
      link: 'https://doi.org/10.3390/info14090502',
    },
    {
      title: 'Coagulation and crystallinity in Sn (II, IV) oxide as an electron transfer layer',
      authors: 'N Usharani, Ramagiri Praveen Kumar, Arnab Bhattacharyya, A Raju',
      journal: 'MRS Advances',
      year: '2024',
      volume: '651-656(9)',
      doi: '10.1557/s43580-024-00801-8',
      link: 'https://doi.org/10.1557/s43580-024-00801-8',
    },
    {
      title: 'H2MaM: Future Air Quality Prediction using LSTM-based Hyper Heuristic Multi-Chain Model',
      authors: 'Sweta Dey, Kalyan Chatterjee, Anjan Bandyopadhyay, Sujata Swain, Mummadi Saaketh, Ramagiri Praveen Kumar',
      journal: 'IEEE Access',
      year: '2023 (Preprint)',
      doi: '10.36227/techrxiv.23813136.v1',
      link: 'https://doi.org/10.36227/techrxiv.23813136.v1',
    },
    {
      title: 'Inherent and induced defects in mixed-phase CuO nanoparticles',
      authors: 'Nannuri Usharani, Ramagiri Praveen Kumar, Arnab Sankar Bhattacharyya, Amireddy Raju',
      journal: 'Next Nanotechnology',
      year: '2024',
      volume: '5, 100030',
      doi: '10.1016/j.nxnano.2023.100030',
      link: 'https://doi.org/10.1016/j.nxnano.2023.100030',
    },
    {
      title: 'Mixed phase of stannic and stannous oxide and their relation to crystallinity',
      authors: 'A S Bhattacharyya, N Usharani, R P Kumar, et al.',
      journal: 'Authorea',
      year: '2023',
      type: 'Preprint',
      doi: '10.22541/au.170052243.31153395/v1',
      link: 'https://doi.org/10.22541/au.170052243.31153395/v1',
    },
    {
      title: 'Morphology and defects in CeO2-ZnO',
      authors: 'N Usharani, RP Kumar, A Bhattacharyya, A Raju',
      journal: 'Materials Science Journal',
      year: '2023',
      type: 'Preprint',
    },
    {
      title: 'Water Demand in Maize Is Projected to Decrease under Changing Climate in India',
      authors: 'Santanu Kumar Bal, Malamal Alickal Sarath Chandran, Sandeep Vadakkemethel Madhavan, Abburi Venkata Maruthi Subba Rao, Narayanan Manikandan, Ramagiri Praveen Kumar, Pramod Valiyaparambil Parameswaran, Shiv Dev Attri, Priyanka Singh, Ashutosh Mohanty, Vinod Kumar Singh',
      journal: 'Sustainability',
      year: '2022',
      volume: '14, 1419',
      doi: '10.3390/su14031419',
      link: 'https://doi.org/10.3390/su14031419',
    },
    {
      title: 'Intensified chipping during nanoindentation and the effect of friction on the interfacial fracture for thin films used in N/MEMS',
      authors: 'R Dash, K Bhattacharyya, R P Kumar, A S Bhattacharyya',
      journal: 'Engineering Research Express',
      year: '2022',
      volume: '4, 045012',
      doi: '10.1088/2631-8695/ac9c85',
      link: 'https://doi.org/10.1088/2631-8695/ac9c85',
    },
    {
      title: 'Bioceramics for medical applications: a computational view',
      authors: 'Ritambhara Dash, Abhay Kumar Rajak, Ramagiri Praveen Kumar, Parameshwar Kommu, Shruti Sharma, Mukesh Gurjar, Arnab Bhattacharyya',
      journal: 'ChemRxiv',
      year: '2022',
      type: 'Preprint',
      doi: '10.26434/chemrxiv-2022-n3tjf',
      link: 'https://doi.org/10.26434/chemrxiv-2022-n3tjf',
    },
    {
      title: 'Nanoindentation stress-strain for fracture analysis and computational modeling for hardness and modulus',
      authors: 'A.S. Bhattacharyya, R.P. Kumar, S. Priyadarshi, Sonu, S. Shivam, S. Anshu',
      journal: 'Journal of Materials Engineering and Performance',
      year: '2018',
      volume: '27: 2719',
    },
    {
      title: 'Deviation in Nano-Mechanical Properties of Ceramic Nano Composite Thin Films',
      authors: 'A.S.Bhattacharyya, R.P. Kumar',
      journal: 'Material Science Research India',
      year: '2017',
      volume: '14(1), 01-04',
    },
    {
      title: 'Nanoindentation Fracture and Computational studies on hard coatings using initial value substitution algorithm',
      authors: 'Kumar RP, Sanatnu Mitra, Bhattacharyya AS',
      journal: 'SciFed Journal of Materials Science',
      year: '2017',
      volume: '1:1',
    },
    {
      title: 'Influence of Substrate nature on the growth of copper oxide thin films',
      authors: 'A. S. Bhattacharyya, S. K. Raj, Parameshwar Kommu, P. Prabhakar, R. Praveen Kumar, Neha Kumari, Kumar Gaurav',
      journal: 'Surface and Interface Analysis',
      year: '2016',
      volume: '48(12) 1294-1298',
    },
    {
      title: 'Analyzing Time on Sample During Nanoindentation',
      authors: 'A.S.Bhattacharyya, R.P.Kumar, et al.',
      journal: 'Material Science Research India',
      year: '2016',
      volume: '13(2), 74-79',
    },
  ]

  return (
    <section id="publications" className="py-16 md:py-24 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
          Research Publications
        </h2>
        <p className="text-muted-foreground mb-12">16+ Peer-reviewed articles in computational science, materials, and AI</p>

        <div className="space-y-4">
          {publications.map((pub, idx) => (
            <div
              key={idx}
              className="bg-card border border-border rounded-xl p-6 cursor-pointer card-hover hover-lift transition-all duration-300 hover:border-accent/50 hover:bg-card/80"
              onClick={() => setExpanded(expanded === idx ? null : idx)}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-2 hover:text-accent transition-colors">
                    {pub.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{pub.authors}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-accent rounded-full font-medium">
                      {pub.journal}
                    </span>
                    <span className="inline-block px-3 py-1 bg-muted text-muted-foreground rounded-full">
                      {pub.year}
                    </span>
                    {pub.type && (
                      <span className="inline-block px-3 py-1 bg-orange-500/10 text-orange-600 rounded-full">
                        {pub.type}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-primary text-xl hover:rotate-180 transition-transform duration-300">
                  {expanded === idx ? '−' : '+'}
                </span>
              </div>

              {expanded === idx && (
                <div className="mt-4 pt-4 border-t border-border animate-fade-in-up">
                  {pub.volume && (
                    <div className="mb-2 text-xs text-muted-foreground">
                      <strong>Volume:</strong> {pub.volume}
                    </div>
                  )}
                  {pub.doi && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground"><strong>DOI:</strong></span>
                      <a
                        href={pub.link || `https://doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent link-hover text-xs font-medium break-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {pub.doi}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

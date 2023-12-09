import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/css/main.css';
import 'antd/dist/reset.css';

import type { Metadata } from 'next'
import { Lato } from 'next/font/google';
import { ChatContextProvider } from '@/context/chatContext';

import DefaultContainer from '@/containers/default';

const lato = Lato({ subsets: ['latin'], weight: ['400', '700'] });

export const metadata: Metadata = {
  title: 'Experttis',
  description: 'Consultancy app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
          crossOrigin="anonymous"
        />
        <link rel="icon" type="image/x-icon" href="./favicon.png"></link>
      </head>
      <body className={lato.className}>
        <ChatContextProvider>
          <DefaultContainer>
            {children}
          </DefaultContainer>
        </ChatContextProvider>
      </body>
    </html >
  )
}
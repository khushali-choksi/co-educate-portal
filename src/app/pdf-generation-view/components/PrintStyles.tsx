'use client';

export default function PrintStyles() {
  return (
    <style jsx global>{`
      @media print {
        body * {
          visibility: hidden;
        }
        #receipt-template,
        #receipt-template * {
          visibility: visible;
        }
        #receipt-template {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          box-shadow: none !important;
        }
        header,
        button,
        .no-print {
          display: none !important;
        }
      }
    `}</style>
  );
}
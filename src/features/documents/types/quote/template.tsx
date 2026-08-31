interface QuoteTemplateProps {
  data: any
}

export function QuoteTemplate({ data }: QuoteTemplateProps) {
  const total = data.items?.reduce((acc: number, item: any) => acc + (item.quantity * item.unitPrice), 0) || 0

  return (
    <div className="p-8 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">QUOTE</h1>
        <p className="text-muted-foreground">{data.title}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold">From:</h3>
          <p>{data.company?.name}</p>
        </div>
        <div>
          <h3 className="font-semibold">To:</h3>
          <p>{data.client?.name}</p>
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Description</th>
            <th className="text-right">Qty</th>
            <th className="text-right">Unit Price</th>
            <th className="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {data.items?.map((item: any, i: number) => (
            <tr key={i} className="border-b">
              <td className="py-2">{item.description || item.product?.name}</td>
              <td className="text-right">{item.quantity}</td>
              <td className="text-right">R$ {item.unitPrice.toFixed(2)}</td>
              <td className="text-right">R$ {(item.quantity * item.unitPrice).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="text-right font-bold py-4">Total:</td>
            <td className="text-right font-bold">R$ {total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>

      {data.observations && (
        <div>
          <h3 className="font-semibold">Observations:</h3>
          <p className="text-muted-foreground">{data.observations}</p>
        </div>
      )}
    </div>
  )
}

'use client'
import { Card, Button, Input } from "antd";


export default function Home() {
  return (
   
      <Card title='CS Department Course Related Resource Repository' className="shadow-md m-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card title='{resource.title}' className="shadow-md">
              <p>{'resource.description'}</p>
              <p className="text-sm text-gray-500">Status: {'resource.status'}</p>
              <div className="mt-2">
                <Button>👍 {'resource.likes'}</Button>
                <Button  className="ml-2">
                  👎 {'resource.dislikes'}
                </Button>
              </div>
            </Card>
            <Card title='{resource.title}' className="shadow-md">
              <p>{'resource.description'}</p>
              <p className="text-sm text-gray-500">Status: {'resource.status'}</p>
              <div className="mt-2">
                <Button>👍 {'resource.likes'}</Button>
                <Button  className="ml-2">
                  👎 {'resource.dislikes'}
                </Button>
              </div>
            </Card>
            <Card title='{resource.title}' className="shadow-md">
              <p>{'resource.description'}</p>
              <p className="text-sm text-gray-500">Status: {'resource.status'}</p>
              <div className="mt-2">
                <Button>👍 {'resource.likes'}</Button>
                <Button  className="ml-2">
                  👎 {'resource.dislikes'}
                </Button>
              </div>
            </Card>
        </div>
      </Card>
  );
}

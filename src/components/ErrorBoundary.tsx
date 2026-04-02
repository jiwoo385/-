import * as React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: any;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // @ts-ignore
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: any): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  public render() {
    // @ts-ignore
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">문제가 발생했습니다.</h2>
          <p className="text-gray-600 mb-4">죄송합니다. 앱 실행 중 오류가 발생했습니다.</p>
          <pre className="bg-gray-100 p-4 rounded text-left overflow-auto max-w-full inline-block text-xs">
            {/* @ts-ignore */}
            {this.state.error?.message || JSON.stringify(this.state.error)}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            className="block mx-auto mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            페이지 새로고침
          </button>
        </div>
      );
    }

    // @ts-ignore
    return this.props.children;
  }
}

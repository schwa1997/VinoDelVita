import { SmileFilled } from '@ant-design/icons';
import { Button, Result } from 'antd';

const ResultContainer = () => {
    return (
        <div
            id="result-container"
            className="tw-z-50 tw-fixed tw-left-1/4 tw-top-1/4 tw-rounded-lg tw-w-1/2 tw-bg-gradient-to-r tw-from-violet-300 tw-via-purple-300 tw-to-violet-50"
        >
            <Result
                icon={<SmileFilled rev={undefined} style={{ color: 'purple' }} />}
                status="success"
                title={
                    <p id="result-container-title" className="tw-text-violet-800">
                        Successfully Submitted
                    </p>
                }
                extra={[
                    <>
                        <Button
                            id="button"
                            onClick={() => {
                                window.location.reload();
                            }}
                        >
                            Refresh
                        </Button>
                        <Button id="button">
                            <a target="_self" href="/">
                                Home Page
                            </a>
                        </Button>
                    </>,
                ]}
            />
        </div>
    );
};
export default ResultContainer;

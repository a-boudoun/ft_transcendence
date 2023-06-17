import LeftTop from './LeftTop';
import LeftBottom from './LeftBottom';

const Left = () => {
    return (
        <div className='w-[90%] h-[40%] mx-[5%] bg-light-gray' >
            <LeftTop/>
            <LeftBottom/>
            
        </div>
    )
}

export default Left;
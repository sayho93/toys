import dynamic from 'next/dynamic'
import {useEffect, useState} from 'react'
import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry'
const Fab = dynamic(() => import('react-tiny-fab').then(mod => mod.Fab), {ssr: false})
import 'react-tiny-fab/dist/styles.css'
import Card from './card'

const Feed = () => {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        console.log(open)
    }, [open])

    return (
        <>
            <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2, 900: 3, 1400: 4}}>
                <Masonry>
                    <Card
                        data={{
                            id: 1,
                            filePath: 'https://dummyimage.com/2268x4032',
                            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
                            author: 'John Doe',
                            width: 2268,
                            height: 4032,
                        }}
                    />
                    <Card
                        data={{
                            id: 1,
                            // filePath: 'https://dummyimage.com/300x900',
                            content:
                                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse non viverra lacus, sed varius lacus. Quisque in tortor nunc. Aliquam at tincidunt nunc. ',
                            author: 'Karen Doe',
                        }}
                    />
                    <Card
                        data={{
                            id: 1,
                            filePath: 'https://dummyimage.com/4032x2268',
                            content:
                                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse non viverra lacus, sed varius lacus. Quisque in tortor nunc. Aliquam at tincidunt nunc. Donec convallis, urna et cursus gravida, erat diam commodo metus, non pharetra mauris arcu nec justo. Etiam pulvinar volutpat rhoncus. Vestibulum ac pellentesque elit. Vestibulum at lacus lorem. Praesent eget massa lorem. Morbi sit amet porta lectus, a luctus arcu.',
                            author: 'Cindy Doe',
                            width: 4032,
                            height: 2268,
                        }}
                    />
                    <Card
                        data={{
                            id: 1,
                            filePath: 'https://dummyimage.com/1125x2436',
                            content:
                                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse non viverra lacus, sed varius lacus. Quisque in tortor nunc. Aliquam at tincidunt nunc. Donec convallis, urna et cursus gravida, erat diam commodo metus, non pharetra mauris arcu nec justo. Etiam pulvinar volutpat rhoncus. Vestibulum ac pellentesque elit. Vestibulum at lacus lorem. Praesent eget massa lorem. Morbi sit amet porta lectus, a luctus arcu.',
                            author: 'Cindy Doe',
                            width: 1125,
                            height: 2436,
                        }}
                    />
                </Masonry>
            </ResponsiveMasonry>

            <Fab color="primary" icon={<i className="bi bi-pencil-fill" />} event={false} onClick={() => setOpen(true)} />
        </>
    )
}

export default Feed

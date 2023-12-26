import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'; 
import { DndContext, closestCenter } from '@dnd-kit/core';
// eslint-disable-next-line react/prop-types
export default function Drag({children, items, handleDragStart, handleDragEnd}){
    return (
        <DndContext onDragStart={handleDragStart || null} onDragEnd={e=>handleDragEnd(e)} collisionDetection={closestCenter}>
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
                {children}
            </SortableContext>
        </DndContext>
    )
}
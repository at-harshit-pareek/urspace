"use client";

import { useState } from "react";
import {
  DndContext,
  useDraggable,
  DragEndEvent,
  DragMoveEvent,
} from "@dnd-kit/core";
import axios from "axios";

interface ImageData {
  id: number;
  image: string;
  x: number;
  y: number;
}

const DraggableImage = ({ id, image, x, y, onDragEnd }: any) => {
  const [initialOffset, setInitialOffset] = useState({ x: 0, y: 0 });

  // The `isDragging` will be used to apply the transformation while dragging.
  const { attributes, listeners, setNodeRef, isDragging, transform } = useDraggable({
    id: id.toString(),
    onDragStart: (event) => {
      // Save the initial position of the image relative to the cursor when dragging starts
      setInitialOffset({
        x: event.clientX - x, // Difference between cursor and image's initial X
        y: event.clientY - y, // Difference between cursor and image's initial Y
      });
    },
  });

  // Use transform to apply movement while dragging, adjusting with initial offset
  const style = {
    position: "absolute",
    left: isDragging ? transform?.x - initialOffset.x : x,
    top: isDragging ? transform?.y - initialOffset.y : y,
    width: "50px",
    height: "50px",
    cursor: "move",
    transition: isDragging ? "none" : "left 0.1s ease, top 0.1s ease", // Smooth transition when not dragging
  };

  return (
    <img
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      src={image}
      alt={`Image ${id}`}
      style={style}
      draggable="false"
      onDragEnd={(event) => onDragEnd(event)}
    />
  );
};

export default function DragDropMap() {
  const [images, setImages] = useState<ImageData[]>([
    { id: 1, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2qobmewiBPpYsOv4gG_M_Suzr4TQuOLd5pKg88hCWDNh_IimbboTbadADxHLJDlnqAgA&usqp=CAU", x: 100, y: 100 },
    { id: 2, image: "https://example.com/image2.jpg", x: 200, y: 200 },
  ]);
  const [confirmedPositions, setConfirmedPositions] = useState<ImageData[]>([]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    if (!delta) return;

    // Update the position of the dragged image
    setImages((prev) =>
      prev.map((img) =>
        img.id === parseInt(active.id)
          ? { ...img, x: img.x + delta.x, y: img.y + delta.y }
          : img
      )
    );
  };

  const handleConfirm = () => {
    setConfirmedPositions(images);
    alert("Positions Confirmed!");
  };

  const handleSave = async () => {
    try {
      const response = await axios.post("/api/save-positions", {
        positions: confirmedPositions,
      });
      if (response.status === 200) {
        alert("Positions saved successfully!");
      }
    } catch (err) {
      console.error("Error saving positions:", err);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="relative w-full h-[500px] border bg-gray-100"> {/* This ensures the container is relative */}
        {images.map((img) => (
          <DraggableImage
            key={img.id}
            {...img}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>
      <div className="flex gap-4 mt-4">
        <button
          onClick={handleConfirm}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Confirm Positions
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Save to Database
        </button>
      </div>
    </DndContext>
  );
}

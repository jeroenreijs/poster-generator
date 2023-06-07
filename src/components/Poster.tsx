import { DragEvent, MouseEvent, ChangeEvent, useRef, useState } from "react";
import JsPDF from "jspdf";

interface imageItem {
  id: string;
  type: "img";
  img: string;
  position: "left" | "right";
}

interface textItem {
  id: string;
  type: "title" | "text";
  text: string;
}

type Item = imageItem | textItem;

function Poster(): JSX.Element {
  const listRef = useRef<HTMLUListElement>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageId, setCurrentImageId] = useState("");
  const [currentImageSrc, setCurrentImageSrc] = useState("");

  const initSortableList = (e: DragEvent<HTMLUListElement>): void => {
    e.preventDefault();
    if (!listRef.current) {
      return;
    }
    const draggingItem = listRef.current.querySelector(".dragging");
    // Getting all items except currently dragging and making array of them
    const siblings = [
      ...listRef.current.querySelectorAll(".item:not(.dragging)"),
    ];
    // Finding the sibling after which the dragging item should be placed
    const nextSibling = siblings.find((sibling) => {
      return (
        e.clientY <=
        (sibling as HTMLElement).offsetTop +
          (sibling as HTMLElement).offsetHeight / 2
      );
    });
    // Inserting the dragging item before the found sibling
    if (draggingItem && nextSibling) {
      listRef.current.insertBefore(draggingItem, nextSibling);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLUListElement>): void => {
    e.preventDefault();
  };

  const handleDragStart = ({ target }: DragEvent<HTMLLIElement>): void => {
    setTimeout(() => (target as HTMLElement).classList.add("dragging"), 0);
  };

  const handleDragEnd = ({ target }: DragEvent<HTMLLIElement>): void => {
    (target as HTMLElement).classList.remove("dragging");
  };

  const handleDoubleClick = ({ target }: MouseEvent<HTMLSpanElement>): void => {
    (target as HTMLElement).setAttribute("contenteditable", "true");
  };

  const handleDoubleClickImage = (id: string): void => {
    if (!listRef.current) {
      return;
    }
    console.log("id", id);
    const currentItem = listRef.current.querySelector(`#item-${id} img`);
    setCurrentImageId(id);
    setCurrentImageSrc(currentItem?.getAttribute("src") || "");
    setShowImageModal(true);
  };

  const changeImageUrl = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (!currentImageId || !listRef.current) {
      return;
    }
    setCurrentImageSrc(target.value);
    const currentItem = listRef.current.querySelector(
      `#item-${currentImageId} img`
    );
    if (currentItem) {
      currentItem.setAttribute("src", target.value);
    }
  };

  const generatePDF = (): void => {
    if (!listRef.current) {
      return;
    }
    const report = new JsPDF("portrait", "pt", "a4");
    const content = listRef.current;
    content.classList.add("print");
    console.log(content);
    report
      .html(content)
      .then(() => {
        report.save("report.pdf");
      })
      .finally(() => {
        content.classList.remove("print");
      });
  };

  const items: Item[] = [
    { id: "1", type: "title", text: "Kristina Zasiado" },
    {
      id: "2",
      type: "img",
      img: "https://placekitten.com/300/300",
      position: "left",
    },
    { id: "3", type: "text", text: "Ronelle Cesicon" },
    { id: "4", type: "title", text: "James Khosravi" },
    {
      id: "5",
      type: "img",
      img: "https://placekitten.com/100/100",
      position: "right",
    },
    { id: "6", type: "text", text: "Donald Horton" },
  ];

  return (
    <>
      {showImageModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Set image URL</p>
            <input
              type="text"
              onChange={changeImageUrl}
              value={currentImageSrc}
            />
            <hr />
            <button
              type="button"
              className="button"
              onClick={() => setShowImageModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div className="wrapper">
        <ul
          ref={listRef}
          className="sortable-list"
          onDragOver={initSortableList}
          onDragEnter={handleDragEnter}
        >
          {items.map((item) => {
            return (
              <li
                key={item.id}
                className="item"
                draggable="true"
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                id={`item-${item.id}`}
              >
                <div className="details">
                  {item.type === "img" && (
                    <span
                      className={item.position}
                      onDoubleClick={() => handleDoubleClickImage(item.id)}
                    >
                      <img src={item.img} />
                    </span>
                  )}
                  {item.type === "title" && (
                    <h1 onDoubleClick={handleDoubleClick}>{item.text}</h1>
                  )}
                  {item.type === "text" && (
                    <span onDoubleClick={handleDoubleClick}>{item.text}</span>
                  )}
                </div>
                <i className="uil uil-draggabledots"></i>
              </li>
            );
          })}
        </ul>
        <button type="button" className="button" onClick={generatePDF}>
          Export PDF
        </button>
      </div>
    </>
  );
}

export default Poster;

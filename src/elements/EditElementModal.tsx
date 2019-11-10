import React from 'react';
import {Element} from '../types';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';

export default ({doubleClickedElement, setDoubleClickedElement}:
                                  {
                                      doubleClickedElement: Element | undefined,
                                      setDoubleClickedElement: (el: Element | undefined) => void
                                  }) => {

    const toggle = () => setDoubleClickedElement(undefined);

    return (
        <div>
            <Modal isOpen={!!doubleClickedElement} toggle={toggle}>
                <ModalHeader toggle={toggle}>Modal title</ModalHeader>
                <ModalBody>
                    {JSON.stringify(doubleClickedElement)}
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={toggle}>Do Something</Button>{' '}
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>);
};

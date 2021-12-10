import React from "react";
// import { Container, Row, Col, Card, CardHeader, CardBody } from "shards-react";
import { Container, Row, Col, Card } from "shards-react";
import { Button } from "./../../node_modules/shards-react";
import PageTitle from "../components/common/PageTitle";
// import PropTypes from "prop-types";
import {
  CardHeader,
  ListGroup,
  ListGroupItem,
  Form,
  FormInput
} from "shards-react";

const FromWarranty = () => (
  <Container fluid className="main-content-container container-boom px-4">
    <Row noGutters className="page-header py-4">
      <PageTitle sm="4" title="FromWarranty" subtitle="" className="text-sm-left" />
    </Row>
    <Card small className="mb-4">
      <CardHeader className="border-bottom">
        ข้อมูลลูกค้า
      </CardHeader>
      <ListGroup flush>
        <ListGroupItem className="p-3">
          <Row>
            <Col>
              <Form>
              <Row form>
                  <Col md="6" className="form-group">
                    <label htmlFor="feMember_ID">สมาชิกบริการ (ถ้ามี)</label>
                    <FormInput
                      id="feMember_ID"
                      placeholder="รหัสสมาชิก"
                      onChange={() => {}}
                    />
                  </Col>
                </Row>

                <Row form>
                  <Col md="6" className="form-group">
                    <label htmlFor="feFirstName">ชื่อ</label>
                    <FormInput
                      id="feFirstName"
                      placeholder="ชื่อ"
                      onChange={() => {}}
                    />
                  </Col>
                  <Col md="6" className="form-group">
                    <label htmlFor="feLastName">นามสกุล</label>
                    <FormInput
                      id="feLastName"
                      placeholder="นามสกุล"
                      onChange={() => {}}
                    />
                  </Col>
                </Row>
                
                <Row form>
                  <Col md="6" className="form-group">
                    <label htmlFor="feTel">เบอร์โทรศัพท์</label>
                    <FormInput
                      id="feTel"
                      placeholder="เบอร์โทรศัพท์"
                      onChange={() => {}}
                    />
                  </Col>
                  <Col md="6" className="form-group">
                    <label htmlFor="fePhone">*มือถือ</label>
                    <FormInput
                      id="fePhone"
                      placeholder="มือถือ"
                      onChange={() => {}}
                    />
                  </Col>
                </Row>

                <Row form>
                  <Col md="12" className="form-group">
                    <label htmlFor="feEmail">อีเมล</label>
                    <FormInput
                      id="feEmail"
                      placeholder="อีเมล"
                      onChange={() => {}}
                    />
                  </Col>
                </Row>
                
                {/* <Button theme="success">AddData</Button> */}
              </Form>
            </Col>
          </Row>
        </ListGroupItem>
      </ListGroup>

      <CardHeader className="border-bottom">
        ที่อยู่การติดตั้ง
      </CardHeader>
      <ListGroup flush>
        <ListGroupItem className="p-3">
          <Row>
            <Col>
              <Form>
              <Row form>
                  <Col md="12" className="form-group">
                    <label htmlFor="feAddressInstall">ที่อยู่ที่ติดตั้งสินค้า* (ไม่สามารถเปลี่ยนแปลงได้)</label>
                    <FormInput
                      id="feAddressInstall"
                      placeholder="ที่อยู่ที่ติดตั้งสินค้า"
                      onChange={() => {}}
                    />
                  </Col>
                </Row>

                <Row form>
                  <Col md="6" className="form-group">
                    <label htmlFor="feProvinceInstall">จังหวัด*</label>
                    <FormInput
                      id="feProvinceInstall"
                      placeholder="จังหวัด"
                      onChange={() => {}}
                    />
                  </Col>
                  <Col md="6" className="form-group">
                    <label htmlFor="feDistrictInstall">อำเภอ/เขต*</label>
                    <FormInput
                      id="feDistrictInstall"
                      placeholder="อำเภอ/เขต"
                      onChange={() => {}}
                    />
                  </Col>
                </Row>
                
                <Row form>
                  <Col md="6" className="form-group">
                    <label htmlFor="feZepCodeInstall">รหัสไปรษณีย์*</label>
                    <FormInput
                      id="feZepCodeInstall"
                      placeholder="รหัสไปรษณีย์"
                      onChange={() => {}}
                    />
                  </Col>
                </Row>
                
                {/* <Button theme="success">AddData</Button> */}
              </Form>
            </Col>
          </Row>
        </ListGroupItem>
      </ListGroup>

      <CardHeader className="border-bottom">
        ข้อมูลสินค้า
      </CardHeader>
      <ListGroup flush>
        <ListGroupItem className="p-3">
          <Row>
            <Col>
              <Form>
              <Row form>
                  <Col md="6" className="form-group">
                    <label htmlFor="feProvincePurchase">จังหวัดที่ซื้อ*</label>
                    <FormInput
                      id="feProvincePurchase"
                      placeholder="จังหวัดที่ซื้อ*"
                      onChange={() => {}}
                    />
                  </Col>
                  <Col md="6" className="form-group">
                    <label htmlFor="feDatePurchase">วัน/เดือน/ปี ที่ซื้อ*</label>
                    <FormInput
                      id="feDatePurchase"
                      placeholder="วัน/เดือน/ปี*"
                      onChange={() => {}}
                    />
                  </Col>
                </Row>

                <Row form>
                  <Col md="6" className="form-group">
                    <label htmlFor="feStoreName">ชื่อร้านตัวแทนจำหน่าย</label>
                    <FormInput
                      id="feStoreName"
                      placeholder="ชื่อร้านตัวแทนจำหน่าย"
                      onChange={() => {}}
                    />
                  </Col>
                  <Col md="6" className="form-group">
                    <label htmlFor="feStoreNameAnother">ชื่อร้านตัวแทนจำหน่าย (อื่นๆ)</label>
                    <FormInput
                      id="feStoreNameAnother"
                      placeholder="ชื่อร้านตัวแทนจำหน่าย (อื่นๆ)"
                      onChange={() => {}}
                    />
                  </Col>
                </Row>
                
                <Row form>
                  <Col md="6" className="form-group">
                    <label htmlFor="feReceiptNumber">หมายเลขใบเสร็จ*</label>
                    <FormInput
                      id="feReceiptNumber"
                      placeholder="หมายเลขใบเสร็จ"
                      onChange={() => {}}
                    />
                  </Col>
                </Row>

                <Row form>
                  <Col md="12" className="form-group">
                    <label htmlFor="feQRCode">รหัสบาร์โค้ด (แสดงที่สติกเกอร์ของกล่องสินค้า)</label>
                    <FormInput
                      id="feQRCode"
                      placeholder="รหัสบาร์โค้ด"
                      onChange={() => {}}
                    />
                  </Col>
                  <Col md="12" className="form-group">
                    <label htmlFor="feQRCode">หมายเลขรับประกัน</label>
                    <FormInput
                      id="feQRCode"
                      placeholder="หมายเลขรับประกัน"
                      onChange={() => {}}
                    />
                  </Col>
                </Row>
                
                <Button theme="success">AddData</Button>
              </Form>
            </Col>
          </Row>
        </ListGroupItem>
      </ListGroup>
    </Card>
  </Container>
);

export default FromWarranty;

import { IconWarningCircle } from "../../../../../assets/icons/IconWarningCircle";
import { IconSuccess } from "../../../../../assets/icons/IconSuccess";
import { Modal } from "../../../../../components/modal/Modal";
import { Box, Button, Typography } from "@mui/material";


interface ModalResultProps {
    open: boolean;
    handleClose: () => void;
    title: string;
    description: string;
    acceptButton?: string;
    type: "success" | "error";
}

export const ModalResult = ({ open, handleClose, title, description, acceptButton, type }: ModalResultProps) => {
    return (
        <Modal open={open} handleClose={handleClose}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: "24px",
                position: 'absolute',
                padding: "48px 46px",
                top: '50%',
                left: '50%',
                outline: 'none',
                transform: 'translate(-50%, -50%)',
                border: "1.72px solid var(--Glass, rgba(255, 255, 255, 0.50))",
                borderRadius: "20px",
                background: "var(--Glass, linear-gradient(108deg, rgba(255, 255, 255, 0.30) 0.04%, rgba(255, 255, 255, 0.10) 51.71%, rgba(255, 255, 255, 0.00) 99.96%))",
                boxShadow: "14px 21px 50px 0px rgba(0, 0, 0, 0.10)",
                backdropFilter: "blur(50px)",
            }}>
                {type === "success" ? <IconSuccess width={56} height={56} /> : <IconWarningCircle width={56} height={56} />}
                <Typography variant="h6" component="h2" sx={{
                    color: type === "success" ? "var(--colorWhite)" : "var(--colorFuxia)",
                    fontWeight: 500,
                    fontSize: "29px",
                    fontFamily: "Mansfield",
                    lineHeight: "30px",
                    textAlign: "center",
                }}>
                    {title}
                </Typography>
                <Typography sx={{
                    maxWidth: "550px",
                    color: "white",
                    fontSize: "15px",
                    lineHeight: "24px",
                    fontFamily: "Mansfield",
                    textAlign: "center",
                }}>
                    {description}
                </Typography>
                {acceptButton &&
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        gap: "24px",
                    }}>
                        <Button onClick={handleClose}
                            style={{
                                width: "100%",
                                background: "var(--colorIndigo)",
                                display: "flex",
                                padding: "16px",
                                color: "white",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: "8.601px",
                                textTransform: "none",
                                alignSelf: "stretch",
                                gap: "8.601px",
                                textAlign: "center",
                                fontFamily: "Mansfield",
                                fontSize: "17.202px",
                                fontStyle: "normal",
                                fontWeight: 500,
                                lineHeight: "normal",
                            }}>{acceptButton}
                        </Button>
                    </Box>
                }
            </Box>
        </Modal>
    );
}
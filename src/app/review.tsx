import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { IconContainer } from "@/components/IconSquare";
import { Input } from "@/components/Input";
import { Colors, Gradients } from "@/constants/theme";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router"; // use expo-router for router hooks
import {
  AlertCircle,
  ArrowLeft,
  ChevronRight,
  Package,
  Store,
} from "lucide-react-native";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Product {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lowConfidence: boolean;
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "PREMIUM COFFEE BEANS 1KG",
    quantity: 2,
    unitPrice: 24.5,
    lowConfidence: false,
  },
  {
    id: "2",
    name: "ORGANIC OAT MILK 1L",
    quantity: 12,
    unitPrice: 3.2,
    lowConfidence: false,
  },
  {
    id: "3",
    name: "ARTISAN SOURDOUGH LOAF",
    quantity: 1,
    unitPrice: 5.5,
    lowConfidence: true,
  },
  {
    id: "4",
    name: "BROWN SUGAR PACKET 500G",
    quantity: 5,
    unitPrice: 1.8,
    lowConfidence: false,
  },
];

export default function ReviewScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const lowConfidenceCount = products.filter((p) => p.lowConfidence).length;
  const totalValue = products.reduce(
    (acc, p) => acc + p.quantity * p.unitPrice,
    0,
  );

  const handleSaveEdit = (updatedProduct: Product) => {
    setProducts(
      products.map((p) =>
        p.id === updatedProduct.id
          ? { ...updatedProduct, lowConfidence: false }
          : p,
      ),
    );
    setEditingProduct(null);
  };

  const handleDeleteRow = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
    setEditingProduct(null);
  };

  return (
    <LinearGradient colors={Gradients.review} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.iconCircle}
          >
            <ArrowLeft size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Review Products</Text>
          <TouchableOpacity>
            <Text style={styles.editAllText}>Edit All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Summary Card */}
          <Card elevated style={styles.summaryCard} padded={false}>
            <View style={styles.summaryInner}>
              <IconContainer
                icon={<Store size={20} color={Colors.primary} />}
                color={Colors.primary}
                size={44}
              />
              <View style={styles.summaryTextBox}>
                <Text style={styles.summaryStore}>WHOLESALE MART</Text>
                <Text style={styles.summaryMeta}>
                  {products.length} products · 19 Apr 2026
                </Text>
              </View>
              <Text style={styles.summaryTotal}>${totalValue.toFixed(2)}</Text>
            </View>
          </Card>

          {/* Warning Banner */}
          {lowConfidenceCount > 0 && (
            <Card elevated style={styles.warningCard} padded={false}>
              <View style={styles.warningInner}>
                <AlertCircle size={20} color={Colors.warning} />
                <Text style={styles.warningText}>
                  {lowConfidenceCount} items need review
                </Text>
              </View>
            </Card>
          )}

          {/* Product List */}
          <View style={styles.list}>
            {products.map((product, i) => {
              const colorKeys = [
                Colors.primary,
                Colors.info,
                Colors.highlight,
                Colors.success,
              ];
              const rowColor = colorKeys[i % colorKeys.length];

              return (
                <Card key={product.id} style={styles.rowCard} padded={false}>
                  <TouchableOpacity
                    style={styles.rowInner}
                    activeOpacity={0.7}
                    onPress={() => setEditingProduct(product)}
                  >
                    {product.lowConfidence && (
                      <View style={styles.lowConfidenceDot} />
                    )}

                    <IconContainer
                      icon={<Package size={16} color={rowColor} />}
                      color={rowColor}
                      size={32}
                    />

                    <View style={styles.rowCenter}>
                      <Text style={styles.productName} numberOfLines={1}>
                        {product.name}
                      </Text>
                      <Text style={styles.productDetailsMono}>
                        {product.quantity} × ${product.unitPrice.toFixed(2)}
                      </Text>
                    </View>

                    <View style={styles.rowRight}>
                      <Text style={styles.totalPriceMono}>
                        ${(product.quantity * product.unitPrice).toFixed(2)}
                      </Text>
                      <ChevronRight
                        size={16}
                        color={Colors.textMuted}
                        style={{ marginLeft: 8 }}
                      />
                    </View>
                  </TouchableOpacity>
                </Card>
              );
            })}
          </View>
        </ScrollView>

        {/* Bottom Sticky Bar */}
        <BlurView intensity={80} tint="light" style={styles.stickyFooter}>
          <Button
            title="Export Products →"
            fullWidth
            onPress={() => router.push("/export")}
          />
        </BlurView>

        {/* Edit Modal (Bottom Sheet) */}
        <Modal
          visible={!!editingProduct}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setEditingProduct(null)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalOverlay}
          >
            <TouchableOpacity
              style={styles.modalBackdrop}
              activeOpacity={1}
              onPress={() => setEditingProduct(null)}
            />

            {editingProduct && (
              <BlurView intensity={90} tint="light" style={styles.bottomSheet}>
                <View style={styles.sheetHandle} />
                <Text style={styles.sheetTitle}>Edit Item</Text>

                <Input
                  label="Product Name"
                  value={editingProduct.name}
                  onChangeText={(text) =>
                    setEditingProduct({ ...editingProduct, name: text })
                  }
                />

                <View style={styles.rowInputs}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Input
                      label="Quantity"
                      value={editingProduct.quantity.toString()}
                      onChangeText={(text) =>
                        setEditingProduct({
                          ...editingProduct,
                          quantity: parseFloat(text) || 0,
                        })
                      }
                      keyboardType="numeric"
                      mono
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Input
                      label="Unit Price ($)"
                      value={editingProduct.unitPrice.toString()}
                      onChangeText={(text) =>
                        setEditingProduct({
                          ...editingProduct,
                          unitPrice: parseFloat(text) || 0,
                        })
                      }
                      keyboardType="decimal-pad"
                      mono
                    />
                  </View>
                </View>

                <Input
                  label="Total Price"
                  value={`$${(editingProduct.quantity * editingProduct.unitPrice).toFixed(2)}`}
                  editable={false}
                  mono
                />

                <View style={{ marginTop: 16 }}>
                  <Button
                    title="Save Changes"
                    onPress={() => handleSaveEdit(editingProduct)}
                    fullWidth
                  />
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteRow(editingProduct.id)}
                  >
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </BlurView>
            )}
          </KeyboardAvoidingView>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.glassBackground,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  title: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 20,
    color: Colors.textPrimary,
  },
  editAllText: {
    fontFamily: "Inter_500Medium",
    color: Colors.primary,
    fontSize: 16,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 140, // sticky footer space
  },
  summaryCard: {
    marginBottom: 16,
  },
  summaryInner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  summaryTextBox: {
    flex: 1,
    marginLeft: 12,
  },
  summaryStore: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  summaryMeta: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  summaryTotal: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 18,
    color: Colors.textPrimary,
  },
  warningCard: {
    marginBottom: 24,
    backgroundColor: "rgba(251, 191, 36, 0.1)",
  },
  warningInner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  warningText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: Colors.warning,
    marginLeft: 12,
  },
  list: { gap: 12 },
  rowCard: { overflow: "visible" },
  rowInner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    position: "relative",
  },
  lowConfidenceDot: {
    position: "absolute",
    left: -4,
    top: "50%",
    marginTop: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.warning,
  },
  rowCenter: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  productDetailsMono: {
    fontFamily: "JetBrainsMono_500Medium",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  totalPriceMono: {
    fontFamily: "JetBrainsMono_500Medium",
    fontSize: 14,
    color: Colors.textPrimary,
  },
  stickyFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 32 : 24,
    borderTopWidth: 1,
    borderTopColor: Colors.glassBorder,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  bottomSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderBottomWidth: 0,
  },
  sheetHandle: {
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(0,0,0,0.1)",
    alignSelf: "center",
    marginBottom: 24,
  },
  sheetTitle: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 24,
    color: Colors.textPrimary,
    marginBottom: 24,
  },
  rowInputs: { flexDirection: "row" },
  deleteButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginTop: 8,
  },
  deleteText: {
    fontFamily: "Inter_500Medium",
    color: Colors.error,
    fontSize: 16,
  },
});
